import { readFileSync } from 'fs'
import { join } from 'path'
import { FoodEntry, round2, safeNum } from './common.js'

export function loadTaco(): FoodEntry[] {
  const raw = readFileSync(join(__dirname, '..', 'taco.json'), 'utf-8')
  const items: any[] = JSON.parse(raw)
  const foods: FoodEntry[] = []

  for (const item of items) {
    const name = item.description?.trim()
    if (!name) continue

    const calories = round2(safeNum(item.energy_kcal))
    const protein = round2(safeNum(item.protein_g))
    const carbs = round2(safeNum(item.carbohydrate_g))
    const fat = round2(safeNum(item.lipid_g))
    const fiber = round2(safeNum(item.fiber_g))
    const sodium = round2(safeNum(item.sodium_mg))

    foods.push({
      name,
      nameOriginal: null,
      source: 'TACO',
      sourceId: String(item.id),
      category: item.category ?? null,
      priority: 100,
      calories,
      protein,
      carbs,
      fat,
      fiber: fiber > 0 ? fiber : null,
      sodium: sodium > 0 ? sodium : null,
    })
  }

  console.log(`[TACO] ${foods.length} alimentos carregados`)
  return foods
}
