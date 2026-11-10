/**
 * Normaliza um texto para comparação de busca: minúsculo, sem acentos,
 * pontuação convertida em espaço (TACO usa "Iogurte, natural" — a vírgula
 * quebraria a detecção de palavra-inteira no ranking).
 */
export function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitSearchWords(query: string): string[] {
  return query.trim().split(/\s+/).filter(Boolean);
}

/**
 * Reordena resultados já filtrados pelo banco. A hierarquia espelha o ORDER BY
 * de FoodService.search() — se divergir, esta função desfaz a ordenação do SQL:
 *
 *   1. Cobertura: nome que contém mais palavras da query ganha
 *   2. Priority maior ganha
 *   3. Match exato (nome normalizado === query) ganha
 *   4. Nome que começa com a query ganha
 *   5. Nome mais curto ganha (mais específico, menos "ruído")
 *   6. Alfabético pt-BR
 *
 * COBERTURA ANTES DE PRIORITY, MATCH EXATO DEPOIS. As duas ordens anteriores
 * falhavam em casos opostos:
 *
 *   - priority em 1º (válido quando priority tinha 3 valores por fonte): com
 *     priority por linha (50–1320), "leite condensado" devolvia "Leite
 *     desnatado" (1060, genérico curado) em vez de "Leite condensado" (735).
 *     Mesmo efeito em "fígado" -> "Figo enlatado", "maçã" -> "Macarrão".
 *
 *   - match exato em 1º: "arroz" devolvia o rótulo "Arroz" (OFF, 374 kcal, arroz
 *     cru) em vez de "Arroz tipo 1 cozido" (TACO, 128 kcal) — erro de ~3x para
 *     quem registra arroz cozido. Idem "feijão" e "queijo".
 *
 * Cobertura resolve os dois porque discrimina exatamente onde eles diferem:
 * em "leite condensado" ela separa (2/2 vs 1/2); em "arroz" ela empata (1/1) e
 * o desempate cai em priority, que é o critério certo ali.
 */
export function rankByRelevance<T extends { name: string; priority?: number }>(
  items: T[],
  query: string,
): T[] {
  const q = normalizeForSearch(query);
  const queryWords = q.split(/\s+/).filter(Boolean);

  return [...items].sort((a, b) => {
    const aName = normalizeForSearch(a.name);
    const bName = normalizeForSearch(b.name);

    const aCover = wordCoverage(aName, queryWords);
    const bCover = wordCoverage(bName, queryWords);
    if (aCover !== bCover) return bCover - aCover;

    const aPrio = a.priority ?? 0;
    const bPrio = b.priority ?? 0;
    if (aPrio !== bPrio) return bPrio - aPrio;

    const aExact = aName === q;
    const bExact = bName === q;
    if (aExact !== bExact) return aExact ? -1 : 1;

    const aStarts = aName.startsWith(q);
    const bStarts = bName.startsWith(q);
    if (aStarts !== bStarts) return aStarts ? -1 : 1;

    if (aName.length !== bName.length) return aName.length - bName.length;

    return aName.localeCompare(bName, 'pt-BR');
  });
}

/**
 * Conta quantas palavras da query aparecem como palavra inteira no nome.
 */
function wordCoverage(name: string, queryWords: string[]): number {
  let count = 0;
  for (const w of queryWords) {
    if (new RegExp(`(^|\\s)${escapeRegExp(w)}(\\s|$)`).test(name)) count++;
  }
  return count;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
