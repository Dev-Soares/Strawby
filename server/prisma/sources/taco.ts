import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { FoodEntry, round2, safeNum } from './common.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

export function loadTaco(): FoodEntry[] {
  // taco.json pode estar em scripts/ ou na raiz de prisma/ — tenta os dois
  const candidates = [
    join(__dirname, '..', 'scripts', 'taco.json'),
    join(__dirname, '..', 'taco.json'),
  ]
  const tacoPath = candidates.find(p => { try { readFileSync(p); return true } catch { return false } })
  if (!tacoPath) throw new Error(`taco.json não encontrado em: ${candidates.join(', ')}`)
  const raw = readFileSync(tacoPath, 'utf-8')
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

    // Pula alimentos sem macros — outras fontes preenchem com dados completos
    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue

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
