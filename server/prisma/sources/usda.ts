import axios from 'axios'
import AdmZip from 'adm-zip'
import { cleanUsdaJunk, FoodEntry, isNutritionPlausible, isValidFoodName, round2, safeNum } from './common.js'
import { translateName } from '../translations.js'
import { hasBrazilianBrand, looksLikeBrand, shouldKeepBrandedFood } from './brands.js'

// Nutrient IDs USDA FDC — Foundation 2024+ usa novos IDs Atwater (2047/2048)
// SR Legacy ainda usa 1008. Fallback chain garante compatibilidade.
const NUTRIENT_ENERGY_KCAL_PRIMARY = '1008'
const NUTRIENT_ENERGY_KCAL_ATWATER_GENERAL = '2047'
const NUTRIENT_ENERGY_KCAL_ATWATER_SPECIFIC = '2048'
const NUTRIENT_PROTEIN = '1003'
const NUTRIENT_CARBS_PRIMARY = '1005' // by difference
const NUTRIENT_CARBS_SUMMATION = '1050' // by summation (fallback)
const NUTRIENT_CARBS_GENERIC = '2039'
const NUTRIENT_FAT_PRIMARY = '1004' // total lipid
const NUTRIENT_FAT_LIPIDS = '2044' // generic lipids fallback
const NUTRIENT_FIBER = '1079'
const NUTRIENT_SODIUM = '1093'

function pickNutrient(map: Map<string, number>, ids: string[]): number {
  for (const id of ids) {
    const v = map.get(id)
    if (v !== undefined && !isNaN(v) && v > 0) return v
  }
  return 0
}

interface UsdaSourceConfig {
  url: string
  source: 'USDA_FOUNDATION' | 'USDA_SR_LEGACY'
  priority: number
  label: string
}

const FOUNDATION: UsdaSourceConfig = {
  url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_csv_2026-04-30.zip',
  source: 'USDA_FOUNDATION',
  priority: 80,
  label: 'Foundation',
}

const SR_LEGACY: UsdaSourceConfig = {
  url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip',
  source: 'USDA_SR_LEGACY',
  priority: 60,
  label: 'SR Legacy',
}

// CSV parser simples para USDA (campos podem conter vírgulas escapadas com aspas).
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]).map((c) => c.replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? ''
    })
    rows.push(row)
  }
  return rows
}

async function downloadAndExtract(url: string): Promise<Map<string, string>> {
  console.log(`[USDA] Baixando ${url}...`)
  const resp = await axios.get(url, { responseType: 'arraybuffer', timeout: 120000 })
  const zip = new AdmZip(Buffer.from(resp.data))
  const entries = new Map<string, string>()
  for (const entry of zip.getEntries()) {
    if (entry.entryName.endsWith('.csv')) {
      const name = entry.entryName.split('/').pop() ?? entry.entryName
      entries.set(name, entry.getData().toString('utf-8'))
    }
  }
  return entries
}

async function loadUsdaSource(cfg: UsdaSourceConfig): Promise<FoodEntry[]> {
  const csvs = await downloadAndExtract(cfg.url)

  const foodCsv = csvs.get('food.csv')
  const nutrientCsv = csvs.get('food_nutrient.csv')

  if (!foodCsv || !nutrientCsv) {
    console.warn(`[USDA ${cfg.label}] CSVs essenciais não encontrados`)
    return []
  }

  console.log(`[USDA ${cfg.label}] Parseando CSVs...`)
  const foodRows = parseCsv(foodCsv)
  const nutrientRows = parseCsv(nutrientCsv)

  // Mapa fdc_id → { nutrientId → amount }
  const nutrientByFood = new Map<string, Map<string, number>>()
  for (const row of nutrientRows) {
    const fdcId = row['fdc_id']
    const nutrientId = row['nutrient_id']
    const amount = parseFloat(row['amount'])
    if (!fdcId || !nutrientId || isNaN(amount)) continue
    if (!nutrientByFood.has(fdcId)) nutrientByFood.set(fdcId, new Map())
    nutrientByFood.get(fdcId)!.set(nutrientId, amount)
  }

  const foods: FoodEntry[] = []

  for (const row of foodRows) {
    const fdcId = row['fdc_id']
    const dataType = row['data_type']
    const rawDescription = row['description']?.trim()
    const description = rawDescription ? cleanUsdaJunk(rawDescription) : ''
    if (!fdcId || !description) continue
    if (!isValidFoodName(description)) continue

    // Foundation: só foundation_food (resto é sample/sub_sample/agricultural — sem macros)
    if (cfg.source === 'USDA_FOUNDATION' && dataType !== 'foundation_food') continue

    // SR Legacy: só sr_legacy_food (defensive)
    if (cfg.source === 'USDA_SR_LEGACY' && dataType !== 'sr_legacy_food') continue

    // Filtra marcas: mantém só genéricas ou marcas BR
    if (!shouldKeepBrandedFood(description)) continue

    const nutrients = nutrientByFood.get(fdcId)
    if (!nutrients) continue

    const calories = round2(
      pickNutrient(nutrients, [
        NUTRIENT_ENERGY_KCAL_PRIMARY,
        NUTRIENT_ENERGY_KCAL_ATWATER_GENERAL,
        NUTRIENT_ENERGY_KCAL_ATWATER_SPECIFIC,
      ]),
    )
    const protein = round2(nutrients.get(NUTRIENT_PROTEIN) ?? 0)
    const carbs = round2(
      pickNutrient(nutrients, [NUTRIENT_CARBS_PRIMARY, NUTRIENT_CARBS_SUMMATION, NUTRIENT_CARBS_GENERIC]),
    )
    const fat = round2(pickNutrient(nutrients, [NUTRIENT_FAT_PRIMARY, NUTRIENT_FAT_LIPIDS]))
    const fiber = round2(nutrients.get(NUTRIENT_FIBER) ?? 0)
    const sodium = round2(nutrients.get(NUTRIENT_SODIUM) ?? 0)

    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
    if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

    // Se é marca BR, mantém nome original. Senão, traduz.
    const isBrand = looksLikeBrand(description) && hasBrazilianBrand(description)
    const finalName = isBrand ? description : translateName(description)

    foods.push({
      name: finalName,
      nameOriginal: description,
      source: cfg.source,
      sourceId: fdcId,
      category: row['food_category_id'] ?? null,
      priority: cfg.priority,
      calories,
      protein,
      carbs,
      fat,
      fiber: fiber > 0 ? fiber : null,
      sodium: sodium > 0 ? sodium : null,
    })
  }

  console.log(`[USDA ${cfg.label}] ${foods.length} alimentos carregados`)
  return foods
}

export function loadUsdaFoundation(): Promise<FoodEntry[]> {
  return loadUsdaSource(FOUNDATION)
}

export function loadUsdaSrLegacy(): Promise<FoodEntry[]> {
  return loadUsdaSource(SR_LEGACY)
}
