import type { FoodPublic } from '../../food/types';
import type { FoodService } from '../../food/food.service';
import {
  normalizeForSearch,
  splitSearchWords,
} from '../../../common/utils/search.utils';

const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Janela de candidatos que o score recebe. Maior que a da busca manual de
 * propósito: em "carne" o corte nobre ("Carne bovina patinho sem gordura
 * grelhado") cai na posição 49 do ranking de relevância — com os 20 do default
 * ele nunca chegaria aqui para ser pontuado.
 */
const CANDIDATE_LIMIT = 60;

const cache = new Map<
  string,
  { result: FoodPublic | null; expiresAt: number }
>();

/**
 * Formas cruas. Penalizadas SÓ quando existe uma versão cozida entre os
 * candidatos — fruta, salada e massa não têm versão cozida no banco, e ali
 * "cru" é a resposta certa. Sem essa trava, "banana" elegeria
 * "Banana doce em barra" (280 kcal) em cima de "Banana prata crua" (98).
 */
const RAW_MARKERS = ['cru', 'crua', 'crus', 'cruas'];

/** Preparações que são o default da mesa brasileira. */
const COOKED_MARKERS = [
  'cozido',
  'cozida',
  'cozidos',
  'cozidas',
  'grelhado',
  'grelhada',
  'assado',
  'assada',
  'refogado',
  'refogada',
];

/** Fritura nunca é default: dobra a caloria em relação ao cozido. */
const FRIED_MARKERS = [
  'frito',
  'frita',
  'fritos',
  'fritas',
  'empanado',
  'empanada',
  'milanesa',
];

/** Miúdos e cortes que ninguém quer dizer com "frango" ou "carne". */
const ODD_CUT_MARKERS = [
  'figado',
  'coracao',
  'moela',
  'bucho',
  'mocoto',
  'lingua',
  'rim',
  'rins',
  'miudo',
  'miudos',
  'dorso',
  'carcaca',
  'pescoco',
  'sebo',
  'tutano',
  'sangue',
  'tripa',
  'charque',
  'seca',
  'seco',
  'defumado',
  'defumada',
  'salgado',
  'salgada',
];

/**
 * Formas concentradas/industrializadas: o macro por 100g não representa o
 * alimento como ele é consumido ("Leite de vaca desnatado pó" tem 361 kcal
 * contra 34 do UHT).
 */
const PROCESSED_MARKERS = [
  'po',
  'instantaneo',
  'instantanea',
  'industrializado',
  'industrializada',
  'concentrado',
  'concentrada',
  'extrato',
  'pure',
  'desidratado',
  'desidratada',
  'liofilizado',
];

/**
 * Componente de receita, não o prato. Quem fala "pastel" comeu um pastel de
 * carne (388 kcal), não massa de pastel frita (570 kcal). Lista curta de
 * propósito: quando o componente é a única linha disponível a penalidade é
 * uniforme e se anula, como em "Lasanha massa fresca cozida".
 */
const COMPONENT_MARKERS = ['massa'];

/**
 * Corte que a pessoa realmente quer dizer ao falar o nome genérico. Peso maior
 * = mais default: "frango" é peito antes de ser frango inteiro.
 */
const CUT_BONUS: Record<string, number> = {
  // Acima de `peito` porque "peito" também é corte de boi, e lá ele é gordo:
  // "Carne bovina peito sem gordura cozido" tem 338 kcal contra 219 do patinho.
  patinho: 110,
  peito: 100,
  file: 100,
  alcatra: 80,
  coxao: 80,
  maminha: 60,
  contrafile: 60,
  coxa: 40,
  sobrecoxa: 40,
  inteiro: 40,
  inteira: 40,
};

/**
 * Conectivos não contam como palavra pedida nem como ruído: "de", "com" e
 * "sem" aparecem em quase todo nome e distorciam tanto a cobertura quanto a
 * penalidade por palavra extra.
 */
const CONNECTORS = new Set([
  'de',
  'da',
  'do',
  'das',
  'dos',
  'com',
  'sem',
  'em',
  'ao',
  'a',
  'o',
  'e',
]);

/**
 * Grupos de preparação. Comparar por grupo (e não palavra a palavra) é o que
 * faz `cru` casar com "crua" e `frito` casar com "à milanesa".
 */
const PREPARATION_GROUPS = [RAW_MARKERS, COOKED_MARKERS, FRIED_MARKERS];

const WEIGHT = {
  /**
   * Abaixo do peso da fonte de propósito: as linhas OFF genéricas ("Arroz",
   * "Queijo") casam exato e têm o pior macro do banco. Nome exato desempata
   * dentro da mesma fonte, não atropela a fonte.
   */
  exactName: 600,
  startsWithQuery: 300,
  /**
   * Maior que qualquer bônus de corte: cobrir o que o usuário pediu vem antes
   * de preferir o corte default. Com 40 aqui, "fígado de frango" perdia para
   * "Filé de Frango assado", que ganhava +100 só por ser filé.
   */
  queryWordPresent: 200,
  /**
   * Primeira palavra do alimento pedido — o substantivo principal. Em "café com
   * leite" o banco não tem a linha composta, então sobram candidatos que casam
   * só "café" ou só "leite": sem este peso vencia "Leite de coco".
   */
  headWordPresent: 120,
  /**
   * O nome do candidato COMEÇA por um alimento que não foi pedido — ou seja ele
   * é outra comida que só por acaso cita o termo buscado. "Couve manteiga crua"
   * casava "manteiga" e virava a manteiga do pão (5 kcal no lugar de 726).
   */
  differentHeadFood: -200,
  /**
   * Preparação do candidato é a que o usuário pediu (mesmo grupo). Menor que
   * `queryWordPresent` de propósito: casar uma palavra do alimento vale mais
   * que casar a preparação, senão "batata inglesa cozida" vira
   * "Nhoque batata cozido" — que também é batata e também é cozido.
   */
  preparationMatch: 150,
  cookedWhenUnspecified: 150,
  /**
   * Candidato que não casa NENHUMA palavra do alimento. O filtro SQL é um OR
   * amplo, então "frango frito" traz "Quibe frito" — sem isso ele ganhava só
   * pela preparação. Penalidade (e não filtro) porque sinônimo legítimo
   * também tem cobertura zero: quem busca "aipim" recebe "Mandioca cozida",
   * e ali a penalidade é uniforme e se anula.
   */
  noIdentityMatch: -800,
  rawUnrequested: -400,
  friedUnrequested: -120,
  oddCutUnrequested: -500,
  processedUnrequested: -250,
  componentUnrequested: -150,
  skinless: 40,
  withSkin: -40,
  /**
   * OFF é rótulo de pacote: o macro vale para o produto da marca, não para o
   * alimento. Precisa superar o bônus de nome exato porque as 39 linhas OFF sem
   * marca no nome são justamente as piores — "Arroz" (374 kcal, macro do grão
   * cru) casava exato e vencia "Arroz tipo 1 cozido" (128 kcal) do TACO.
   */
  brandedSource: -600,
  /**
   * Substitui o desempate por `length ASC` do ranking de relevância, que era o
   * que elegia "Frango fígado cru" (17 chars) na frente de
   * "Frango peito sem pele grelhado" (30). Palavra sobrando ainda conta como
   * ruído, mas agora perde para preparação e corte.
   */
  extraWord: -8,
} as const;

const BRAND_STOPWORDS = [
  'nestle',
  'bauducco',
  'lider',
  'vigor',
  'danone',
  'yakult',
  'oreo',
  'mcdonalds',
  'kfc',
  'subway',
  'pizza hut',
  'dominos',
  'swift',
  'sadia',
  'perdigao',
  'perdigão',
  'seara',
  'aurora',
  'frimesa',
  'marba',
  'catupiry',
  'taeq',
  'carrefour',
  'tio joao',
  'tio joão',
  'camil',
  'urbano',
  'primor',
  'elefante',
  'coamo',
  'tirol',
  'batavo',
  'dore',
  'becel',
  'qualy',
  'wafer',
  'recheio',
  'biscoito recheado',
  'salgadinho',
  'batata frita embalada',
  'coca',
  'pepsi',
  'guarana',
  'suco em po',
  'achocolatado em po',
  'leite condensado',
  'creme de leite',
  'granola keto',
  'barra de cereal',
  'protein bar',
  'salpicao',
  'salpicão',
  'empanado',
  'nuggets',
  'hamburguer congelado',
];

function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
}

/**
 * Usa `normalizeForSearch` (e não só lowercase + strip de acento) porque a
 * pontuação tem que virar espaço para o casamento por palavra inteira
 * funcionar: "Ovo de galinha inteiro cozido/10minutos" só revela o marcador
 * `cozido` depois que a barra sai.
 */
export function normalize(value: string): string {
  return normalizeForSearch(value);
}

/**
 * Detector de rótulo. O padrão "Marca - Produto" cobre 3907 das 3946 linhas
 * OFF e não precisa de manutenção — a lista de marcas sempre fica atrás do
 * banco ("Quero - Ketchup Pizza" entrava como resposta para "pizza" porque
 * `quero` não estava nela). As 39 linhas OFF sem o padrão são nomes genéricos
 * legítimos ("Pasta de amendoim") e seguem elegíveis.
 */
export function isIndustrializedOrBrand(name: string): boolean {
  if (name.includes(' - ')) return true;
  const normalized = normalize(name);
  return BRAND_STOPWORDS.some((term) => normalized.includes(normalize(term)));
}

export type FoodMatchOptions = {
  /** Preparação que a IA extraiu da fala do usuário (`cozido`, `cru`, ...). */
  preparation?: string | null;
};

export async function findPublicFoodMatch(
  name: string,
  food: FoodService,
  options: FoodMatchOptions = {},
): Promise<FoodPublic | null> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return null;

  const preparation = normalizePreparation(options.preparation);
  const cacheKey = `${normalize(trimmed)}|${preparation ?? ''}`;

  if (cache.size > 1000) cleanExpiredEntries();

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const match = await searchPublicFoodMatch(trimmed, preparation, food);
  cache.set(cacheKey, { result: match, expiresAt: Date.now() + CACHE_TTL_MS });
  return match;
}

async function searchPublicFoodMatch(
  name: string,
  preparation: string | null,
  food: FoodService,
): Promise<FoodPublic | null> {
  // Primeira tentativa com a preparação no texto da busca: "arroz tipo 1" +
  // "cozido" casa exato com a linha certa do TACO em vez de depender do score.
  if (preparation && !hasWord(normalize(name), preparation)) {
    const withPreparation = await pickBestCandidate(
      `${name} ${preparation}`,
      preparation,
      food,
    );

    // Só vale se a busca enviesada trouxe de fato a preparação pedida. Quando
    // a combinação não existe, o filtro SQL exige a palavra e devolve um
    // conjunto torto: "pescada grelhado" sobrava só com a linha crua, que
    // vencia porque nenhum preparado entrou na lista para penalizá-la. Cair
    // para a segunda passada dá o conjunto completo ("Pescada filé frito").
    if (
      withPreparation &&
      matchesRequestedPreparation(
        wordSet(withPreparation.name),
        new Set([preparation]),
      )
    ) {
      return withPreparation;
    }
  }

  // Sem a preparação: quando ela não existe no banco (massa não tem linha
  // cozida), devolve o melhor disponível em vez de nada.
  return pickBestCandidate(name, preparation, food);
}

async function pickBestCandidate(
  query: string,
  preparation: string | null,
  food: FoodService,
): Promise<FoodPublic | null> {
  const results = await food.search(query, CANDIDATE_LIMIT);

  // Marca cai fora antes da pontuação: sem alimento genérico disponível o
  // assistente prefere dizer que não encontrou a trocar o macro por um rótulo.
  const candidates = results.filter((f) => !isIndustrializedOrBrand(f.name));
  if (candidates.length === 0) return null;

  const normalizedQuery = normalize(query);
  const requested = new Set(
    splitSearchWords(normalizedQuery).filter((word) => !CONNECTORS.has(word)),
  );
  if (preparation) requested.add(preparation);

  // Identidade do alimento x preparação: "batata inglesa" identifica,
  // "cozido" prepara. Separar os dois é o que impede a preparação de valer
  // como se fosse o nome do alimento.
  const identityList = [...requested].filter(
    (word) => !isPreparationMarker(word),
  );
  const identityWords = new Set(identityList);

  const context: ScoreContext = {
    normalizedQuery,
    requested,
    identityWords,
    headWord: identityList[0] ?? null,
    hasRequestedPreparation: identityWords.size !== requested.size,
    maxCoverageAmongPrepared: maxCoverageAmongPrepared(
      candidates,
      identityWords,
    ),
  };

  let best: FoodPublic | null = null;
  let bestScore = -Infinity;

  for (const candidate of candidates) {
    const score = scoreCandidate(candidate, context);
    // `>` e não `>=`: em empate vence quem veio primeiro, ou seja o ranking de
    // relevância continua valendo como desempate.
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  // O filtro SQL é um OR amplo (trigram incluso), então ele devolve candidato
  // que não tem nada a ver com o pedido. Quando NENHUM casa uma palavra do
  // alimento, a penalidade `noIdentityMatch` é uniforme e o vencedor sai por
  // sorteio — era assim que uma comida fora do banco virava um alimento
  // aleatório no diário. Dizer que não encontrou é melhor que registrar errado.
  if (
    best &&
    context.identityWords.size > 0 &&
    coverage(wordSet(best.name), context.identityWords) === 0
  ) {
    return null;
  }

  return best;
}

type ScoreContext = {
  normalizedQuery: string;
  /** Palavras que o usuário disse — cada penalidade abaixo as respeita. */
  requested: Set<string>;
  /** `requested` sem os marcadores de preparação: só o que nomeia o alimento. */
  identityWords: Set<string>;
  /** Substantivo principal do pedido (primeira palavra de identidade). */
  headWord: string | null;
  hasRequestedPreparation: boolean;
  /**
   * Melhor cobertura da query entre os candidatos JÁ PREPARADOS — cozidos ou
   * fritos. O cru só é penalizado se existir um preparado que atenda o pedido
   * igual ou melhor:
   *
   * - "fígado de frango" só tem linha crua, então o cru passa (sem isso vinha
   *   "Filé de Frango assado");
   * - "pastel" tem "Pastel massa frita", e olhar só os cozidos deixava
   *   "Pastel massa crua" (massa de pastel sem fritar) ganhar.
   */
  maxCoverageAmongPrepared: number;
};

function scoreCandidate(candidate: FoodPublic, ctx: ScoreContext): number {
  const normalizedName = normalize(candidate.name);
  const words = splitSearchWords(normalizedName);
  const nameWords = new Set(words);

  // Fonte entra como a coluna `priority` do banco (TACO=100 > IBGE_POF=95 >
  // OFF=90) em vez de um mapa local que duplicava e contradizia esse valor.
  let score = candidate.priority ?? 0;

  if (candidate.source === 'OFF') score += WEIGHT.brandedSource;

  if (normalizedName === ctx.normalizedQuery) {
    score += WEIGHT.exactName;
  } else if (normalizedName.startsWith(ctx.normalizedQuery)) {
    score += WEIGHT.startsWithQuery;
  }

  const identityCoverage = coverage(nameWords, ctx.identityWords);
  score += identityCoverage * WEIGHT.queryWordPresent;

  if (ctx.headWord && nameWords.has(ctx.headWord)) {
    score += WEIGHT.headWordPresent;
  }

  // Primeira palavra do nome é o alimento principal daquela linha. Se ela não
  // está no pedido, o candidato é outra comida: "Couve manteiga" é couve, não
  // manteiga; "Bolo de aipim" é bolo, não aipim.
  const candidateHead = words[0];
  if (
    ctx.identityWords.size > 0 &&
    candidateHead &&
    !ctx.identityWords.has(candidateHead)
  ) {
    score += WEIGHT.differentHeadFood;
  }

  if (ctx.identityWords.size > 0 && identityCoverage === 0) {
    score += WEIGHT.noIdentityMatch;
  }

  if (
    hasAnyMarker(nameWords, RAW_MARKERS) &&
    !hasAnyMarker(ctx.requested, RAW_MARKERS) &&
    identityCoverage <= ctx.maxCoverageAmongPrepared
  ) {
    score += WEIGHT.rawUnrequested;
  }

  if (ctx.hasRequestedPreparation) {
    if (matchesRequestedPreparation(nameWords, ctx.requested)) {
      score += WEIGHT.preparationMatch;
    }
  } else if (hasAnyMarker(nameWords, COOKED_MARKERS)) {
    score += WEIGHT.cookedWhenUnspecified;
  }

  // Pele muda o macro o bastante para desempatar: "Frango peito com pele
  // assado" tem 212 kcal contra 184 do sem pele, e os dois nomes têm o mesmo
  // número de palavras.
  if (!ctx.requested.has('pele')) {
    if (normalizedName.includes('sem pele')) score += WEIGHT.skinless;
    else if (normalizedName.includes('com pele')) score += WEIGHT.withSkin;
  }

  if (
    hasAnyMarker(nameWords, FRIED_MARKERS) &&
    !hasAnyMarker(ctx.requested, FRIED_MARKERS)
  ) {
    score += WEIGHT.friedUnrequested;
  }

  score += unrequestedMarkerPenalty(
    nameWords,
    ctx.requested,
    ODD_CUT_MARKERS,
    WEIGHT.oddCutUnrequested,
  );

  score += unrequestedMarkerPenalty(
    nameWords,
    ctx.requested,
    PROCESSED_MARKERS,
    WEIGHT.processedUnrequested,
  );

  score += unrequestedMarkerPenalty(
    nameWords,
    ctx.requested,
    COMPONENT_MARKERS,
    WEIGHT.componentUnrequested,
  );

  for (const [cut, bonus] of Object.entries(CUT_BONUS)) {
    if (nameWords.has(cut)) score += bonus;
  }

  const extraWords = words.filter(
    (word) => !ctx.requested.has(word) && !CONNECTORS.has(word),
  ).length;
  score += extraWords * WEIGHT.extraWord;

  return score;
}

/**
 * O candidato está na mesma preparação que o usuário pediu? Compara por grupo,
 * então "crua" atende quem pediu `cru` e "à milanesa" atende quem pediu frito.
 */
function isPreparationMarker(word: string): boolean {
  return PREPARATION_GROUPS.some((group) => group.includes(word));
}

function matchesRequestedPreparation(
  nameWords: Set<string>,
  requested: Set<string>,
): boolean {
  return PREPARATION_GROUPS.some(
    (group) => hasAnyMarker(requested, group) && hasAnyMarker(nameWords, group),
  );
}

function coverage(nameWords: Set<string>, requested: Set<string>): number {
  let covered = 0;
  for (const word of requested) {
    if (nameWords.has(word)) covered++;
  }
  return covered;
}

function maxCoverageAmongPrepared(
  candidates: FoodPublic[],
  requested: Set<string>,
): number {
  let max = -1;
  for (const candidate of candidates) {
    const nameWords = wordSet(candidate.name);
    const isPrepared =
      hasAnyMarker(nameWords, COOKED_MARKERS) ||
      hasAnyMarker(nameWords, FRIED_MARKERS);
    if (!isPrepared) continue;
    max = Math.max(max, coverage(nameWords, requested));
  }
  return max;
}

/**
 * Aplica a penalidade apenas pelos marcadores que o usuário NÃO pediu. Quem
 * fala "fígado de frango" ou "carne seca" continua recebendo o alimento certo.
 */
function unrequestedMarkerPenalty(
  nameWords: Set<string>,
  requested: Set<string>,
  markers: string[],
  penalty: number,
): number {
  const present = markers.filter((marker) => nameWords.has(marker));
  const unrequested = present.filter((marker) => !requested.has(marker));
  return unrequested.length > 0 ? penalty : 0;
}

function normalizePreparation(preparation?: string | null): string | null {
  if (!preparation) return null;
  const normalized = normalize(preparation);
  return normalized.length > 0 ? normalized : null;
}

function wordSet(name: string): Set<string> {
  return new Set(splitSearchWords(normalize(name)));
}

function hasAnyMarker(words: Set<string>, markers: string[]): boolean {
  return markers.some((marker) => words.has(marker));
}

function hasWord(haystack: string, word: string): boolean {
  return splitSearchWords(haystack).includes(word);
}
