import { Client } from 'pg'
import { SUGGESTED_MEALS } from '../../src/modules/strawby-assistant/data/suggested-meals.data'

const url = 'postgresql://postgres.lifnpwplayvorftlnvil:J54Zxn7l6CD3anMh@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true'

const SOURCE_PRIORITY: Record<string, number> = {
  TACO: 1,
  TBCA: 2,
  IBGE_POF: 3,
  USDA_FOUNDATION: 4,
  USDA_SR_LEGACY: 5,
  CNF: 6,
  LIVS: 7,
  MANUAL: 8,
  OFF: 9,
}

// Maps normalized suggested item name -> exact food name in the DB.
const NAME_OVERRIDES: Record<string, string> = {
  'ovos mexidos': 'Ovo de galinha inteiro cru',
  'ovo cozido': 'Ovo de galinha inteiro cozido',
  'ovos cozidos': 'Ovo de galinha inteiro cozido',
  'ovos': 'Ovo de galinha inteiro cru',
  'claras de ovo': 'Clara de ovo de galinha crua',
  'banana': 'Banana prata crua',
  'maca': 'Maçã com casca crua',
  'maçã': 'Maçã com casca crua',
  'laranja': 'Laranja pera crua',
  'morangos': 'Morango cru',
  'pessego em cubos': 'Pêssego cru',
  'frutas vermelhas': 'Morango cru',
  'abacate': 'Abacate cru',
  'pao integral': 'Pão integral',
  'pao integral torrado': 'Pão integral',
  'torrada integral': 'Adria - Torrada Integral',
  'torradas integrais': 'Adria - Torrada Integral',
  'torradinha integral': 'Adria - Torrada Integral',
  'pao de queijo': 'Pão de queijo assado',
  'tapioca': 'Tapioca com manteiga',
  'tapioca com banana e canela': 'Tapioca com manteiga',
  'aveia em flocos': 'Aveia em flocos crua',
  'iogurte natural desnatado': 'Iogurte natural desnatado',
  'iogurte natural': 'Iogurte natural',
  'iogurte grego natural': 'Batavo - Iogurte Grego Tradicional',
  'requeijao light': 'Catupiry - Requeijão Cremoso Light',
  'queijo branco': 'Queijo de Minas',
  'queijo muçarela': 'Mussarela',
  'queijo feta': 'Queijo de Minas',
  'granola': 'Jasmine - Granola Tradicional',
  'pasta de amendoim': 'Growth - Pasta de Amendoim Integral Natural',
  'cafe preto': 'Café infusão 10%',
  'cha de camomila': 'Chá preto infusão 5%',
  'cha de ervas': 'Chá preto infusão 5%',
  'leite desnatado': 'Leite desnatado',
  'leite desnatado morno': 'Leite desnatado',
  'leite de amendoas': 'Leite de Soja com Sabor',
  'whey protein': 'Leite em pó desnatado',
  'smoothie de proteina': 'Leite em pó desnatado',
  'arroz branco': 'Arroz branco cozido',
  'arroz integral': 'Arroz integral cozido',
  'feijao carioca': 'Feijão carioca cozido',
  'macarrao cozido': 'Macarrão cozido',
  'macarrao para yakissoba': 'Macarrão cozido',
  'batata doce cozida': 'Batata doce cozida',
  'batata doce': 'Batata doce cozida',
  'quinoa cozida': 'Quinoa',
  'grao de bico': 'Grão de Bico',
  'hummus': 'Grão de Bico',
  'peito de frango grelhado': 'Peito de frango grelhado',
  'frango desfiado': 'Sadia - Peito de Frango Cozido Desfiado Congelado na Receita',
  'frango grelhado em tiras': 'Peito de frango grelhado',
  'frango em tiras': 'Peito de frango grelhado',
  'frango ao curry': 'Peito de Galinha ou Frango cozido',
  'file de peixe grelhado': 'Swift - Peixe Alasca',
  'atum em agua': 'Atum em Conserva Light',
  'carne moida refogada': 'Carne Moída refogada',
  'peito de peru': 'Peito de Peru',
  'creme de abobora': 'Abóbora cabotian cozida',
  'sopa de legumes': 'Aurora - Legumes Cozidos no Vapor',
  'legumes cozidos': 'Aurora - Legumes Cozidos no Vapor',
  'legumes salteados': 'Aurora - Legumes Cozidos no Vapor',
  'abobrinha grelhada': 'Abobrinha italiana cozida',
  'cenoura cozida': 'Cenoura cozida',
  'brocolis cozido': 'Brócolis cozido',
  'brocolis no vapor': 'Brócolis cozido',
  'abobora cabotian cozida': 'Abóbora cabotian cozida',
  'tomate': 'Tomate',
  'tomate cereja': 'Tomate',
  'alface americana': 'Alface americana crua',
  'salada verde': 'Alface americana crua',
  'salada de alface e tomate': 'Alface americana crua',
  'folhas verdes': 'Alface americana crua',
  'alface e tomate': 'Alface americana crua',
  'salada de folhas': 'Alface americana crua',
  'salada grega com frango': 'Alface americana crua',
  'azeite de oliva': 'Azeite de Oliva',
  'molho de tomate': 'Molho de Tomate',
  'molho caesar light': 'Molho de Soja Light',
  'croutons': 'Adria - Torrada Integral',
  'gelatina zero': 'Predilecta - Gelatina Zero',
  'chantilly light': 'Creme de Leite Light',
  'cacau em po': 'Dona Benta - Cacau em Pó',
  'canela em po': 'Yoki - Canela em Pó Kitano',
  'canela': 'Yoki - Canela em Pó Kitano',
  'mel': 'Mel',
  'biscoito de agua e sal': 'Adria - Biscoito Água e Sal',
  'barrinha de cereal': 'Biscoito Doce',
  'barra de proteina': 'Biscoito Doce',
  'castanhas sortidas': 'Castanha de Caju',
  'mix de castanhas': 'Castanha de Caju',
  'castanha do para': 'Castanha-do-pará',
  'amendoin': 'Amendoim (em Grão) (In Natura)',
  'panqueca de banana': 'Bolo de banana',
  'crepioca de frango': 'Tapioca com manteiga',
  'escondidinho de frango': 'Mandioca',
  'risoto de frango': 'Arroz branco cozido',
  'yakissoba de frango': 'Macarrão cozido',
  'salada caesar com frango': 'Alface americana crua',
  'wrap integral': 'Pão de forma integral',
  'wrap de frango com salada': 'Pão de forma integral',
  'sopa de legumes com frango': 'Aurora - Legumes Cozidos no Vapor',
  'omelete com salada': 'Ovo de galinha inteiro cru',
  'omelete de queijo e tomate': 'Ovo de galinha inteiro cru',
  'panqueca de claras com queijo': 'Clara de ovo de galinha crua',
  'leite morno com mel e biscoito': 'Leite desnatado',
  'cha com torrada': 'Adria - Torrada Integral',
  'pao com abacate e ovo': 'Pão integral',
  'iogurte com granola e frutas': 'Iogurte natural desnatado',
  'panqueca de banana e aveia': 'Bolo de banana',
  'smoothie de frutas com whey': 'Leite em pó desnatado',
  'pao de queijo com fruta': 'Pão de queijo assado',
  'arroz feijao frango e salada': 'Arroz branco cozido',
  'arroz integral carne moida e legumes': 'Arroz integral cozido',
  'macarrao com molho e frango desfiado': 'Macarrão cozido',
  'salada com atum grao de bico e quinoa': 'Quinoa',
  'peixe grelhado com batata doce e brocolis': 'Swift - Peixe Alasca',
  'frango ao curry com arroz': 'Peito de Galinha ou Frango cozido',
  'escondidinho de frango com salada': 'Mandioca',
  'risoto de frango com legumes': 'Arroz branco cozido',
  'yakissoba de frango': 'Macarrão cozido',
  'iogurte grego com frutas': 'Batavo - Iogurte Grego Tradicional',
  'banana com pasta de amendoim': 'Banana prata crua',
  'ovo cozido com torrada': 'Ovo de galinha inteiro cozido',
  'tapioca com banana e canela': 'Tapioca com manteiga',
  'gelatina natural com frutas': 'Predilecta - Gelatina Zero',
  'sopa de legumes com frango': 'Aurora - Legumes Cozidos no Vapor',
  'salada com peito de peru': 'Peito de Peru',
  'omelete com salada': 'Ovo de galinha inteiro cru',
  'wrap de frango com salada': 'Pão de forma integral',
  'peixe grelhado com legumes': 'Swift - Peixe Alasca',
  'atum com salada e azeite': 'Atum em Conserva Light',
  'creme de abobora com frango desfiado': 'Abóbora cabotian cozida',
  'salada grega com frango': 'Alface americana crua',
  'ovos cozidos com salada e torrada': 'Ovo de galinha inteiro cozido',
  'frango grelhado com salada verde': 'Peito de frango grelhado',
  'cha com torrada': 'Adria - Torrada Integral',
  'iogurte natural com canela': 'Iogurte natural desnatado',
  'frutas vermelhas com iogurte': 'Iogurte natural',
  'leite morno com mel e biscoito': 'Leite desnatado',
  'queijo branco com torrada': 'Queijo de Minas',
  'gelatina zero com chantilly': 'Predilecta - Gelatina Zero',
  'maçã com canela': 'Maçã com casca crua',
  'cha de ervas com barrinha de cereal': 'Biscoito Doce',
  'panqueca de claras com queijo': 'Clara de ovo de galinha crua',
  'leite vegetal com cacau': 'Leite de Soja com Sabor',
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string): string[] {
  return normalize(value).split(' ').filter(Boolean)
}

function scoreCandidate(itemName: string, food: { name: string; source: string }): number {
  const itemNorm = normalize(itemName)
  const foodNorm = normalize(food.name)
  const itemTokens = tokenize(itemName)
  const foodTokens = tokenize(food.name)

  if (foodNorm === itemNorm) return 10000
  if (foodNorm.startsWith(itemNorm + ' ')) return 5000
  if (itemNorm.startsWith(foodNorm + ' ')) return 4000
  if (foodNorm.includes(itemNorm)) return 3000
  if (itemNorm.includes(foodNorm)) return 2000

  const overlap = itemTokens.filter((t) => foodTokens.includes(t)).length
  const extraTokens = foodTokens.length - overlap
  let score = (overlap / Math.max(itemTokens.length, 1)) * 1000
  score -= extraTokens * 50

  if (foodNorm.includes('cru')) score += 80
  if (foodNorm.includes('cozido')) score += 60
  if (foodNorm.includes('grelhado')) score += 50

  const penaltyWords = ['congelado', 'enlatado', 'embalado', 'industrializado', 'recheado', 'salgadinho', 'nuggets', 'empanado']
  penaltyWords.forEach((word) => {
    if (foodNorm.includes(word)) score -= 100
  })

  score -= (SOURCE_PRIORITY[food.source] ?? 99) * 10

  return score
}

async function findCandidates(client: Client, itemName: string) {
  const normalized = normalize(itemName)
  const tokens = tokenize(itemName)

  const { rows } = await client.query(
    `
    SELECT id, name, calories, protein, carbs, fat, source
    FROM "Food"
    WHERE (
      unaccent(lower(name)) LIKE unaccent(lower($1))
      ${tokens.map((_, i) => `OR unaccent(lower(name)) LIKE unaccent(lower($${i + 2}))`).join('')}
    )
    ORDER BY priority DESC
    LIMIT 100
    `,
    [`%${normalized}%`, ...tokens.map((t) => `%${t}%`)],
  )

  return rows
}

async function findBestMatch(client: Client, itemName: string) {
  const overrideKey = normalize(itemName)
  const overrideName = NAME_OVERRIDES[overrideKey]

  if (overrideName) {
    const { rows } = await client.query(
      `SELECT id, name, calories, protein, carbs, fat, source FROM "Food" WHERE unaccent(lower(name)) = unaccent(lower($1)) LIMIT 1`,
      [overrideName],
    )
    if (rows.length > 0) return rows[0]
  }

  const candidates = await findCandidates(client, itemName)
  if (candidates.length === 0) return null

  const scored = candidates.map((row) => ({ ...row, score: scoreCandidate(itemName, row) }))
  scored.sort((a, b) => b.score - a.score)

  return scored[0]
}

function round(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals
}

async function main() {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()

  const result: Record<string, any[]> = {}
  const unmatched: { meal: string; item: string }[] = []

  for (const [mealType, meals] of Object.entries(SUGGESTED_MEALS)) {
    result[mealType] = []
    for (const meal of meals) {
      const items = []
      for (const item of meal.items) {
        const match = await findBestMatch(client, item.name)
        if (!match) {
          unmatched.push({ meal: meal.name, item: item.name })
          continue
        }

        const ratio = item.calories > 0 && match.calories > 0 ? item.calories / match.calories : 0
        const quantity = round(ratio * 100, 0)

        items.push({
          foodId: match.id,
          name: item.name,
          quantity,
          unit: 'g',
          calories: round(match.calories * ratio),
          protein: round(match.protein * ratio),
          carbs: round(match.carbs * ratio),
          fat: round(match.fat * ratio),
        })
      }

      result[mealType].push({
        name: meal.name,
        mealType: meal.mealType,
        reason: meal.reason,
        items,
      })
    }
  }

  await client.end()

  console.log(JSON.stringify(result, null, 2))

  if (unmatched.length > 0) {
    console.error('\n\nUNMATCHED ITEMS:')
    console.error(JSON.stringify(unmatched, null, 2))
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
