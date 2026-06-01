import axios from 'axios'
import AdmZip from 'adm-zip'
import { cleanUsdaJunk, FoodEntry, isNutritionPlausible, isValidFoodNameLoose, round2, safeNum } from './common.js'
import { translateName } from '../translations.js'

// Nutrient IDs USDA FDC
const N_ENERGY_1     = '1008'  // SR Legacy + Foundation legacy
const N_ENERGY_2     = '2047'  // Foundation 2024+ Atwater general
const N_ENERGY_3     = '2048'  // Foundation 2024+ Atwater specific
const N_PROTEIN      = '1003'
const N_CARBS_1      = '1005'  // by difference
const N_CARBS_2      = '1050'  // by summation
const N_CARBS_3      = '2039'  // generic
const N_FAT_1        = '1004'  // total lipid
const N_FAT_2        = '2044'  // generic lipids
const N_FIBER        = '1079'
const N_SODIUM       = '1093'

function pickNutrient(map: Map<string, number>, ids: string[]): number {
  for (const id of ids) {
    const v = map.get(id)
    if (v !== undefined && !isNaN(v) && v >= 0) return v
  }
  return 0
}

interface UsdaSource {
  url: string
  source: FoodEntry['source']
  priority: number
  dataType: string
  label: string
}

const FOUNDATION: UsdaSource = {
  url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_csv_2026-04-30.zip',
  source: 'USDA_FOUNDATION',
  priority: 80,
  dataType: 'foundation_food',
  label: 'Foundation',
}

const SR_LEGACY: UsdaSource = {
  url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip',
  source: 'USDA_SR_LEGACY',
  priority: 60,
  dataType: 'sr_legacy_food',
  label: 'SR Legacy',
}

// Survey = FNDDS: alimentos consumidos em pesquisas nacionais — alta qualidade, muito práticos
const SURVEY: UsdaSource = {
  url: 'https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_csv_2024-10-31.zip',
  source: 'USDA_SR_LEGACY', // mesma enum, priority diferente
  priority: 65,
  dataType: 'survey_fndds_food',
  label: 'Survey FNDDS',
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (c === ',' && !inQ) {
      result.push(cur); cur = ''
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
    if (cols.length < 2) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = cols[idx] ?? '' })
    rows.push(row)
  }
  return rows
}

async function downloadAndExtract(url: string): Promise<Map<string, string>> {
  console.log(`[USDA] Baixando ${url.split('/').pop()}...`)
  const resp = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 180000,
    onDownloadProgress: (p) => {
      if (p.total) {
        const pct = Math.round((p.loaded / p.total) * 100)
        if (pct % 25 === 0) process.stdout.write(`\r[USDA] Download: ${pct}%   `)
      }
    },
  })
  console.log()
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

async function loadUsdaSource(cfg: UsdaSource): Promise<FoodEntry[]> {
  const csvs = await downloadAndExtract(cfg.url)

  const foodCsv    = csvs.get('food.csv')
  const nutrientCsv = csvs.get('food_nutrient.csv')

  if (!foodCsv || !nutrientCsv) {
    console.warn(`[USDA ${cfg.label}] CSVs essenciais ausentes`)
    return []
  }

  console.log(`[USDA ${cfg.label}] Parseando CSVs...`)
  const foodRows    = parseCsv(foodCsv)
  const nutrientRows = parseCsv(nutrientCsv)

  // fdc_id → { nutrientId → amount }
  const nutrientByFood = new Map<string, Map<string, number>>()
  for (const row of nutrientRows) {
    const fdcId     = row['fdc_id']
    const nutrientId = row['nutrient_id']
    const amount    = parseFloat(row['amount'])
    if (!fdcId || !nutrientId || isNaN(amount)) continue
    if (!nutrientByFood.has(fdcId)) nutrientByFood.set(fdcId, new Map())
    nutrientByFood.get(fdcId)!.set(nutrientId, amount)
  }

  const foods: FoodEntry[] = []

  for (const row of foodRows) {
    const fdcId      = row['fdc_id']
    const dataType   = row['data_type']
    const rawDesc    = row['description']?.trim()

    if (!fdcId || !rawDesc) continue
    if (dataType !== cfg.dataType) continue

    const description = cleanUsdaJunk(rawDesc)
    if (!description) continue
    if (!isValidFoodNameLoose(description)) continue

    const nutrients = nutrientByFood.get(fdcId)
    if (!nutrients) continue

    const calories = round2(pickNutrient(nutrients, [N_ENERGY_1, N_ENERGY_2, N_ENERGY_3]))
    const protein  = round2(pickNutrient(nutrients, [N_PROTEIN]))
    const carbs    = round2(pickNutrient(nutrients, [N_CARBS_1, N_CARBS_2, N_CARBS_3]))
    const fat      = round2(pickNutrient(nutrients, [N_FAT_1, N_FAT_2]))
    const fiber    = round2(nutrients.get(N_FIBER) ?? 0)
    const sodium   = round2(nutrients.get(N_SODIUM) ?? 0)

    if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
    if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

    const translatedName = translateName(description)

    foods.push({
      name: translatedName,
      nameOriginal: rawDesc !== translatedName ? rawDesc : null,
      source: cfg.source,
      sourceId: fdcId,
      category: row['food_category_id'] || null,
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

export function loadUsdaSurvey(): Promise<FoodEntry[]> {
  return loadUsdaSource(SURVEY)
}
