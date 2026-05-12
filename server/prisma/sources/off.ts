import axios from 'axios'
import { FoodEntry, isNutritionPlausible, isValidFoodName, round2, safeNum, sleep } from './common.js'
import { hasBrazilianBrand, looksLikeBrand, shouldKeepBrandedFood } from './brands.js'

// Open Food Facts — produtos brasileiros (busca ampla)
// Estratégia: pega top-N por scans no Brasil + filtro qualidade + whitelist marca BR.
// Diferente da v1: mais paginação, filtro só na palavra (não categoria).

const MAX_PAGES = 50
const MAX_RETRIES = 3
const BASE_DELAY = 4000
const REQUEST_DELAY = 1500
const MIN_SCANS = 10 // bem mais permissivo

export async function loadOpenFoodFacts(): Promise<FoodEntry[]> {
  const foods: FoodEntry[] = []
  const seenCodes = new Set<string>()
  let page = 1
  let totalReq = 0
  let emptyPages = 0

  console.log('[OFF] Buscando produtos brasileiros (top por popularidade)...')

  while (page <= MAX_PAGES) {
    let success = false
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await axios.get('https://world.openfoodfacts.org/api/v2/search', {
          params: {
            countries_tags: 'en:brazil',
            fields: 'product_name,product_name_pt,nutriments,categories_tags,unique_scans_n,code,lang',
            sort_by: 'unique_scans_n',
            page_size: 100,
            page,
          },
          timeout: 30000,
        })
        totalReq++
        const products: any[] = resp.data?.products ?? []
        if (products.length === 0) {
          emptyPages++
          if (emptyPages >= 2) {
            console.log('[OFF] Sem mais produtos.')
            success = true
            break
          }
          success = true
          break
        }
        emptyPages = 0

        for (const p of products) {
          if (!p.code || seenCodes.has(p.code)) continue
          seenCodes.add(p.code)

          // Prefere nome PT, fallback nome geral
          const name = (p.product_name_pt?.trim() || p.product_name?.trim() || '').replace(/\s+/g, ' ')
          if (!name || !isValidFoodName(name)) continue

          // Se parece marca, exige whitelist BR
          if (!shouldKeepBrandedFood(name)) continue

          const scans = parseInt(p.unique_scans_n ?? '0', 10)
          if (scans < MIN_SCANS) continue

          const n = p.nutriments ?? {}
          const calories = round2(safeNum(n['energy-kcal_100g']))
          const protein = round2(safeNum(n['proteins_100g']))
          const carbs = round2(safeNum(n['carbohydrates_100g']))
          const fat = round2(safeNum(n['fat_100g']))
          const fiber = round2(safeNum(n['fiber_100g']))
          const sodium = round2(safeNum(n['sodium_100g']) * 1000)

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
        }
        success = true
        break
      } catch (err: any) {
        const status = err.response?.status
        const retryable = status === 503 || status === 429 || err.code === 'ECONNRESET'
        if (attempt < MAX_RETRIES && retryable) {
          await sleep(BASE_DELAY * attempt)
        }
      }
    }
    if (!success) break
    if (emptyPages >= 2) break
    if (page % 10 === 0) console.log(`[OFF] p${page}/${MAX_PAGES} — ${foods.length} acumulados`)
    page++
    await sleep(REQUEST_DELAY)
  }

  console.log(`[OFF] ${foods.length} alimentos carregados (${totalReq} requisições)`)
  return foods
}
