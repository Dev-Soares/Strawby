import axios from 'axios'
import { FoodEntry, isNutritionPlausible, isValidFoodName, round2, sleep } from './common.js'
import { translateName } from '../translations.js'
import { hasBrazilianBrand, looksLikeBrand, shouldKeepBrandedFood } from './brands.js'

// Livsmedelsverket (Swedish Food Agency) — CC BY 4.0, comercial OK
const API_BASE = 'https://dataportal.livsmedelsverket.se/livsmedel/api/v1'
const PAGE_SIZE = 100

// Nutrientes — match por nome (case-insensitive)
const NUTRIENT_PATTERNS = {
  energy: ['energi (kcal)', 'energy (kcal)'],
  protein: ['protein'],
  carbs: ['kolhydrater', 'carbohydrates', 'tillgängliga kolhydrater'],
  fat: ['fett, totalt', 'fat, total', 'total fett'],
  fiber: ['fiber', 'kostfiber'],
  sodium: ['natrium', 'sodium'],
}

interface LivsFood {
  nummer: number
  namn: string
}

interface LivsListResp {
  _meta: { totalRecords: number; offset: number; limit: number; count: number }
  livsmedel: LivsFood[]
}

interface LivsNutrient {
  namn?: string
  varde: number | string
}

function findNutrient(nutrients: LivsNutrient[], patterns: string[]): number {
  for (const n of nutrients) {
    if (!n.namn) continue
    const lower = n.namn.toLowerCase()
    if (patterns.some((p) => lower.includes(p))) {
      const val = typeof n.varde === 'string' ? parseFloat(n.varde.replace(',', '.')) : n.varde
      if (!isNaN(val) && val >= 0) return val
    }
  }
  return 0
}

export async function loadLivsmedelsverket(maxItems: number = 2500): Promise<FoodEntry[]> {
  try {
    // 1. Pagina lista completa de alimentos
    const allFoods: LivsFood[] = []
    let offset = 0
    let total = Infinity

    console.log(`[LIVS] Paginando lista de alimentos...`)
    while (offset < total && allFoods.length < maxItems) {
      const r = await axios.get<LivsListResp>(`${API_BASE}/livsmedel`, {
        params: { offset, limit: PAGE_SIZE, sprak: 1 },
        timeout: 60000,
      })
      const items = r.data.livsmedel ?? []
      total = r.data._meta?.totalRecords ?? items.length
      allFoods.push(...items)
      offset += PAGE_SIZE
      if (items.length < PAGE_SIZE) break
    }
    console.log(`[LIVS] ${allFoods.length} alimentos no índice (${total} total)`)

    // 2. Busca nutrientes de cada alimento (limita maxItems)
    const limit = Math.min(allFoods.length, maxItems)
    const entries: FoodEntry[] = []

    for (let i = 0; i < limit; i++) {
      const food = allFoods[i]
      if (!food?.namn || !isValidFoodName(food.namn)) continue
      if (!shouldKeepBrandedFood(food.namn)) continue

      try {
        const nr = await axios.get<LivsNutrient[]>(
          `${API_BASE}/livsmedel/${food.nummer}/naringsvarden`,
          { timeout: 30000 },
        )
        const nutrients = nr.data

        const calories = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.energy))
        const protein = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.protein))
        const carbs = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.carbs))
        const fat = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.fat))
        const fiber = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.fiber))
        const sodium = round2(findNutrient(nutrients, NUTRIENT_PATTERNS.sodium))

        if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
        if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

        const isBrand = looksLikeBrand(food.namn) && hasBrazilianBrand(food.namn)
        const finalName = isBrand ? food.namn : translateName(food.namn)

        entries.push({
          name: finalName,
          nameOriginal: food.namn,
          source: 'LIVS',
          sourceId: String(food.nummer),
          category: null,
          priority: 50,
          calories,
          protein,
          carbs,
          fat,
          fiber: fiber > 0 ? fiber : null,
          sodium: sodium > 0 ? sodium : null,
        })

        if ((i + 1) % 200 === 0) {
          console.log(`[LIVS] ${i + 1}/${limit} processados, ${entries.length} válidos`)
        }
        await sleep(30)
      } catch {
        // pula item falho, continua
      }
    }

    console.log(`[LIVS] ${entries.length} alimentos carregados`)
    return entries
  } catch (err: any) {
    console.warn(`[LIVS] Falha ao carregar: ${err.message}`)
    return []
  }
}
