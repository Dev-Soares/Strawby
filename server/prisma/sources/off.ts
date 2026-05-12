import axios from 'axios'
import { FoodEntry, isNutritionPlausible, isValidFoodName, round2, safeNum, sleep } from './common.js'
import { BR_BRANDS } from './brands.js'

// Open Food Facts v4 — marca por marca, rate-limit suave.
// OFF dá 503 facilmente; estratégia: 1 marca por vez, 3s entre reqs, retry forte.

const REQUEST_DELAY_MS = 3000
const RETRY_DELAY_MS = 8000
const MAX_RETRIES = 4
const PAGE_SIZE = 50
const MAX_PAGES_PER_BRAND = 2
const MIN_SCANS = 1 // não filtra por scans pois muitas marcas BR têm scans baixos

const HEADERS = {
  'User-Agent': 'Strawby/1.0 - https://strawby.com',
}

// Marcas mais conhecidas BR — buscadas direto (subset de brands.ts, sem genéricos)
const TARGETED_BRANDS = [
  'coca-cola', 'pepsi', 'guaraná antarctica', 'fanta', 'sprite', 'schweppes',
  'red bull', 'monster', 'gatorade', 'powerade',
  'nescau', 'toddy', 'nesfit', 'sucrilhos', 'corn flakes', 'cheerios', 'quaker',
  'mãe terra', 'jasmine', 'taeq', 'belive',
  'nestlé', 'parmalat', 'itambé', 'piracanjuba', 'tirol', 'danone', 'activia',
  'vigor', 'batavo', 'paulista', 'ninho', 'mococa', 'molico',
  'polenghi', 'philadelphia', 'catupiry', 'qboa',
  'lacta', 'nestlé chocolate', 'garoto', 'nestlé bombom',
  'kit kat', 'snickers', 'twix', 'm&m', 'ferrero', 'nutella', 'kinder',
  'cacau show', 'lindt', 'ovomaltine', 'halls', 'mentos', 'tic tac',
  'bauducco', 'piraquê', 'adria', 'fortaleza', 'mabel',
  'oreo', 'tortuguita', 'trakinas', 'negresco', 'club social', 'cream cracker',
  'aymoré', 'marilan',
  'doritos', 'cheetos', 'fandangos', 'ruffles', 'pringles', 'lay\'s',
  'elma chips', 'baconzitos', 'cebolitos', 'torcida',
  'wickbold', 'pullman', 'visconti', 'plus vita', 'panco', 'nutrella',
  'barilla', 'renata', 'galo', 'petybon', 'vitarella',
  'heinz', 'hellmann\'s', 'arisco', 'knorr', 'maggi', 'sazon',
  'kitano', 'predilecta', 'quero', 'fugini', 'tarantella', 'cica',
  'gallo', 'soya', 'liza', 'concórdia',
  'qualy', 'doriana', 'becel',
  'sadia', 'perdigão', 'aurora', 'seara', 'friboi', 'swift',
  'kibon', 'magnum', 'cornetto', 'fini', 'paçoquita', 'dr oetker',
  'fleischmann', 'royal',
  'yopro', 'whey protein', 'integralmedica', 'max titanium', 'probiotica',
  'mcdonald\'s', 'burger king', 'subway', 'kfc',
  'campbell\'s', 'kraft', 'mucilon',
]

async function fetchBrandPage(brand: string, page: number) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await axios.get('https://world.openfoodfacts.org/api/v2/search', {
        params: {
          countries_tags: 'en:brazil',
          brands_tags: brand,
          fields: 'product_name,product_name_pt,brands,nutriments,unique_scans_n,code,lang,categories_tags',
          sort_by: 'unique_scans_n',
          page_size: PAGE_SIZE,
          page,
        },
        headers: HEADERS,
        timeout: 30000,
      })
      return r.data?.products ?? []
    } catch (err: any) {
      const status = err.response?.status
      const retryable = status === 503 || status === 429 || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'
      if (attempt < MAX_RETRIES && retryable) {
        await sleep(RETRY_DELAY_MS * attempt)
        continue
      }
      return []
    }
  }
  return []
}

function getName(p: any): string {
  return (p.product_name_pt?.trim() || p.product_name?.trim() || '').replace(/\s+/g, ' ')
}

export async function loadOpenFoodFacts(): Promise<FoodEntry[]> {
  const foods: FoodEntry[] = []
  const seenCodes = new Set<string>()

  console.log(`[OFF] Buscando ${TARGETED_BRANDS.length} marcas BR (1 por vez, ~${TARGETED_BRANDS.length * REQUEST_DELAY_MS / 1000}s)`)

  let brandIdx = 0
  for (const brand of TARGETED_BRANDS) {
    brandIdx++
    let brandCount = 0
    for (let page = 1; page <= MAX_PAGES_PER_BRAND; page++) {
      const products = await fetchBrandPage(brand, page)
      if (products.length === 0) break

      for (const p of products) {
        if (!p.code || seenCodes.has(p.code)) continue
        seenCodes.add(p.code)

        const name = getName(p)
        if (!name || !isValidFoodName(name)) continue

        const scans = parseInt(String(p.unique_scans_n ?? 0)) || 0
        if (scans < MIN_SCANS) continue

        const n = p.nutriments ?? {}
        const calories = round2(safeNum(n['energy-kcal_100g']))
        const protein = round2(safeNum(n['proteins_100g']))
        const carbs = round2(safeNum(n['carbohydrates_100g']))
        const fat = round2(safeNum(n['fat_100g']))
        const fiber = round2(safeNum(n['fiber_100g']))
        const sodium = round2(safeNum(n['sodium_100g']) * 1000) // g → mg

        if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
        if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

        foods.push({
          name,
          nameOriginal: name,
          source: 'OFF',
          sourceId: p.code,
          category: Array.isArray(p.categories_tags) ? p.categories_tags[0] ?? null : null,
          priority: 40,
          calories,
          protein,
          carbs,
          fat,
          fiber: fiber > 0 ? fiber : null,
          sodium: sodium > 0 ? sodium : null,
        })
        brandCount++
      }

      if (products.length < PAGE_SIZE) break // última página
      await sleep(REQUEST_DELAY_MS)
    }
    if (brandIdx % 10 === 0 || brandCount > 0) {
      console.log(`[OFF] ${brandIdx}/${TARGETED_BRANDS.length} — ${brand}: +${brandCount} (total ${foods.length})`)
    }
    await sleep(REQUEST_DELAY_MS)
  }

  console.log(`[OFF] ${foods.length} alimentos carregados`)
  return foods
}
