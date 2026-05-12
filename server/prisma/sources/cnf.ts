import axios from 'axios'
import { FoodEntry, isNutritionPlausible, isValidFoodName, round2 } from './common.js'
import { translateName } from '../translations.js'
import { hasBrazilianBrand, looksLikeBrand, shouldKeepBrandedFood } from './brands.js'

// CNF REST API — Health Canada (Open Government Licence Canada, comercial OK)
const API_BASE = 'https://food-nutrition.canada.ca/api/canadian-nutrient-file'

// CNF NutrientNameID (verificado via /nutrientname endpoint)
const NUTRIENT_ENERGY_KCAL = 208
const NUTRIENT_PROTEIN = 203
const NUTRIENT_CARBS = 205
const NUTRIENT_FAT = 204
const NUTRIENT_FIBER = 291
const NUTRIENT_SODIUM = 307

interface CnfFood {
  food_code: number
  food_description: string
}

interface CnfNutrient {
  food_code: number
  nutrient_value: number
  nutrient_name_id: number
}

export async function loadCnf(): Promise<FoodEntry[]> {
  try {
    console.log('[CNF] Baixando lista de alimentos...')
    const foodResp = await axios.get<CnfFood[]>(`${API_BASE}/food/?lang=en&type=json`, {
      timeout: 120000,
    })
    const foods = foodResp.data
    console.log(`[CNF] ${foods.length} alimentos no índice`)

    console.log('[CNF] Baixando todas as quantidades de nutrientes (pode demorar ~30s)...')
    const nutrResp = await axios.get<CnfNutrient[]>(
      `${API_BASE}/nutrientamount/?lang=en&type=json`,
      { timeout: 300000 },
    )
    const nutrients = nutrResp.data
    console.log(`[CNF] ${nutrients.length} valores nutricionais carregados`)

    // Mapa food_code → { nutrient_name_id → value }
    const byFood = new Map<number, Map<number, number>>()
    for (const n of nutrients) {
      if (!byFood.has(n.food_code)) byFood.set(n.food_code, new Map())
      byFood.get(n.food_code)!.set(n.nutrient_name_id, n.nutrient_value)
    }

    const entries: FoodEntry[] = []
    for (const food of foods) {
      const name = food.food_description?.trim()
      if (!name) continue
      if (!isValidFoodName(name)) continue
      if (!shouldKeepBrandedFood(name)) continue

      const fn = byFood.get(food.food_code)
      if (!fn) continue

      const calories = round2(fn.get(NUTRIENT_ENERGY_KCAL) ?? 0)
      const protein = round2(fn.get(NUTRIENT_PROTEIN) ?? 0)
      const carbs = round2(fn.get(NUTRIENT_CARBS) ?? 0)
      const fat = round2(fn.get(NUTRIENT_FAT) ?? 0)
      const fiber = round2(fn.get(NUTRIENT_FIBER) ?? 0)
      const sodium = round2(fn.get(NUTRIENT_SODIUM) ?? 0)

      if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
      if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

      const isBrand = looksLikeBrand(name) && hasBrazilianBrand(name)
      const finalName = isBrand ? name : translateName(name)

      entries.push({
        name: finalName,
        nameOriginal: name,
        source: 'CNF',
        sourceId: String(food.food_code),
        category: null,
        priority: 70,
        calories,
        protein,
        carbs,
        fat,
        fiber: fiber > 0 ? fiber : null,
        sodium: sodium > 0 ? sodium : null,
      })
    }

    console.log(`[CNF] ${entries.length} alimentos válidos`)
    return entries
  } catch (err: any) {
    console.warn(`[CNF] Falha ao carregar: ${err.message}`)
    return []
  }
}
