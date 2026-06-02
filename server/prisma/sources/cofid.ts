import axios from 'axios'
import XLSX from 'xlsx'
import { cleanUsdaJunk, FoodEntry, isNutritionPlausible, isValidFoodNameLoose, round2 } from './common.js'
import { translateName } from '../scripts/translations.js'

// McCance & Widdowson's CoFID 2021 — Open Government Licence v3
// Banco de dados britânico de referência mundial, ~3.200 alimentos
const COFID_URL =
  'https://assets.publishing.service.gov.uk/media/60538b91e90e07527df82ae4/McCance_Widdowsons_Composition_of_Foods_Integrated_Dataset_2021..xlsx'

function parseVal(v: unknown): number {
  if (v === null || v === undefined || v === '') return 0
  if (typeof v === 'number') return isNaN(v) ? 0 : Math.max(0, v)
  const s = String(v).trim()
  if (!s || s === 'N' || s === 'Tr' || s === 'n' || s === '*') return 0
  // "< 0.1" → 0, "Tr" = trace → 0
  if (s.startsWith('<') || /^tr(ace)?s?$/i.test(s)) return 0
  const n = parseFloat(s.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : n
}

function col(headers: string[], ...kw: string[]): string | undefined {
  for (const k of kw) {
    const h = headers.find((h) => h.toLowerCase().includes(k.toLowerCase()))
    if (h) return h
  }
  return undefined
}

export async function loadCofid(): Promise<FoodEntry[]> {
  try {
    console.log('[CoFID] Baixando McCance & Widdowson 2021...')
    const resp = await axios.get(COFID_URL, {
      responseType: 'arraybuffer',
      timeout: 180000,
      onDownloadProgress: (p) => {
        if (p.total) process.stdout.write(`\r[CoFID] ${Math.round((p.loaded / p.total) * 100)}%   `)
      },
    })
    console.log()

    const wb = XLSX.read(Buffer.from(resp.data), { type: 'buffer' })

    // CoFID tem múltiplas sheets — usa a que tem mais linhas e parece ter dados nutricionais
    let bestSheet = wb.SheetNames[0]
    let bestRows: Record<string, any>[] = []
    for (const sn of wb.SheetNames) {
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(wb.Sheets[sn], { defval: '' })
      if (rows.length > bestRows.length) {
        bestRows = rows
        bestSheet = sn
      }
    }

    console.log(`[CoFID] Usando sheet "${bestSheet}" com ${bestRows.length} linhas`)

    if (bestRows.length === 0) {
      console.warn('[CoFID] Nenhuma linha encontrada')
      return []
    }

    const headers = Object.keys(bestRows[0])
    const name   = col(headers, 'food name', 'name', 'description', 'food_name')
    const code   = col(headers, 'food code', 'code', 'fdc_id')
    const group  = col(headers, 'food group', 'group', 'category')
    const kcal   = col(headers, 'kcal', 'energy', 'energie')
    const prot   = col(headers, 'protein')
    const carb   = col(headers, 'carbohydrate', 'carbs')
    const fat    = col(headers, 'fat', 'total fat')
    const fibre  = col(headers, 'fibre', 'fiber', 'dietary fibre')
    const sodium = col(headers, 'sodium', 'na ')

    if (!name || !kcal) {
      console.warn(`[CoFID] Colunas não encontradas. Sheets: ${wb.SheetNames.join(', ')}. Headers: ${headers.slice(0, 15).join(' | ')}`)
      return []
    }

    const entries: FoodEntry[] = []
    for (const row of bestRows) {
      const rawName = String(row[name] ?? '').trim()
      if (!rawName || rawName.length < 2) continue

      const cleaned = cleanUsdaJunk(rawName)
      if (!isValidFoodNameLoose(cleaned)) continue

      const calories = round2(parseVal(row[kcal]))
      const protein  = round2(parseVal(prot ? row[prot] : 0))
      const carbs    = round2(parseVal(carb ? row[carb] : 0))
      const fatVal   = round2(parseVal(fat ? row[fat] : 0))
      const fiber    = round2(parseVal(fibre ? row[fibre] : 0))
      const sod      = round2(parseVal(sodium ? row[sodium] : 0))

      if (calories === 0 && protein === 0 && carbs === 0 && fatVal === 0) continue
      if (!isNutritionPlausible(calories, protein, carbs, fatVal)) continue

      const translated = translateName(cleaned)

      entries.push({
        name: translated,
        nameOriginal: cleaned !== translated ? cleaned : null,
        source: 'CNF',       // reusa CNF até enum COFID ser adicionado ao schema
        sourceId: code ? String(row[code] ?? '').trim() || null : null,
        category: group ? String(row[group] ?? '').trim() || null : null,
        priority: 68,        // entre SR Legacy(60) e CNF(70)
        calories,
        protein,
        carbs,
        fat: fatVal,
        fiber: fiber > 0 ? fiber : null,
        sodium: sod > 0 ? sod : null,
      })
    }

    console.log(`[CoFID] ${entries.length} alimentos carregados`)
    return entries
  } catch (err: any) {
    console.warn(`[CoFID] Falha: ${err.message}`)
    return []
  }
}
