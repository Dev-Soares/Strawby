import axios from 'axios'
import XLSX from 'xlsx'
import { cleanUsdaJunk, FoodEntry, isNutritionPlausible, isValidFoodNameLoose, round2 } from './common.js'
import { translateName } from '../scripts/translations.js'

// ANSES-Ciqual 2020 — Open Data ANSES, usage libre
// Tabela francesa com nomes em inglês disponíveis
const CIQUAL_URL =
  'https://ciqual.anses.fr/cms/sites/default/files/inline-files/Table%20Ciqual%202020_ENG_2020%2007%2007.xls'

function parseVal(v: unknown): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0
  if (typeof v === 'number') return isNaN(v) ? 0 : Math.max(0, v)
  const s = String(v).trim()
  if (!s || s === '-') return 0
  // "< 0.05" ou "traces" → 0
  if (s.startsWith('<') || /^traces?$/i.test(s)) return 0
  const n = parseFloat(s.replace(',', '.'))
  return isNaN(n) || n < 0 ? 0 : n
}

// Procura coluna pelo keyword (case-insensitive, retorna primeiro match)
function col(headers: string[], ...kw: string[]): string | undefined {
  for (const k of kw) {
    const h = headers.find((h) => h.toLowerCase().includes(k.toLowerCase()))
    if (h) return h
  }
  return undefined
}

export async function loadCiqual(): Promise<FoodEntry[]> {
  try {
    console.log('[CIQUAL] Baixando tabela ANSES 2020...')
    const resp = await axios.get(CIQUAL_URL, {
      responseType: 'arraybuffer',
      timeout: 120000,
      onDownloadProgress: (p) => {
        if (p.total) process.stdout.write(`\r[CIQUAL] ${Math.round((p.loaded / p.total) * 100)}%   `)
      },
    })
    console.log()

    const wb = XLSX.read(Buffer.from(resp.data), { type: 'buffer' })
    // Usa primeira sheet (a única ou a principal)
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    if (rows.length === 0) {
      console.warn('[CIQUAL] Planilha vazia')
      return []
    }

    const headers = Object.keys(rows[0])

    // Colunas exatas do Ciqual 2020 ENG (verificadas via debug)
    const nameEn  = col(headers, 'alim_nom_eng', 'nom_ang', 'nom_eng')
    const code    = col(headers, 'alim_code')
    const group   = col(headers, 'alim_ssgrp_nom_eng', 'ssgrp_nom_eng', 'grp_nom_eng')
    // Duas colunas de energia — Jones factor é mais completa; EU regulation como fallback
    const kcalJ   = col(headers, "jones' factor, with fibres (kcal", 'jones')
    const kcalEU  = col(headers, 'regulation eu', 'kcal/100g')
    const prot    = col(headers, 'Protein (g/100g)', 'protein')
    const carb    = col(headers, 'Carbohydrate (g/100g)', 'carbohydrate')
    const lipid   = col(headers, 'Fat (g/100g)', 'fat (g')
    const fibre   = col(headers, 'Fibres (g/100g)', 'fibres', 'fiber')
    const naCol   = col(headers, 'Sodium (mg/100g)', 'sodium')  // já em mg, sem conversão

    if (!nameEn) {
      console.warn(`[CIQUAL] Coluna de nome não encontrada. Headers: ${headers.slice(0, 15).join(' | ')}`)
      return []
    }

    const entries: FoodEntry[] = []
    for (const row of rows) {
      const rawName = String(row[nameEn] ?? '').trim()
      if (!rawName || rawName === '-') continue

      const name = cleanUsdaJunk(rawName)
      if (!isValidFoodNameLoose(name)) continue

      const protein  = round2(parseVal(prot   ? row[prot]   : 0))
      const carbs    = round2(parseVal(carb   ? row[carb]   : 0))
      const fat      = round2(parseVal(lipid  ? row[lipid]  : 0))
      const fiber    = round2(parseVal(fibre  ? row[fibre]  : 0))
      const sodium   = round2(parseVal(naCol  ? row[naCol]  : 0))

      // Ciqual tem muitos alimentos sem energia medida ("-") — calcula dos macros
      let calories = round2(parseVal(kcalJ ? row[kcalJ] : 0))
      if (calories === 0) calories = round2(parseVal(kcalEU ? row[kcalEU] : 0))
      if (calories === 0 && (protein > 0 || carbs > 0 || fat > 0)) {
        calories = round2(protein * 4 + carbs * 4 + fat * 9)
      }

      if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
      if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

      const translated = translateName(name)

      entries.push({
        name: translated,
        nameOriginal: name !== translated ? name : null,
        source: 'CNF',       // reusa CNF até enum CIQUAL ser adicionado ao schema
        sourceId: code ? String(row[code] ?? '').trim() || null : null,
        category: group ? String(row[group] ?? '').trim() || null : null,
        priority: 72,        // entre Foundation(80) e CNF(70)
        calories,
        protein,
        carbs,
        fat,
        fiber: fiber > 0 ? fiber : null,
        sodium: sodium > 0 ? sodium : null,
      })
    }

    console.log(`[CIQUAL] ${entries.length} alimentos carregados`)
    return entries
  } catch (err: any) {
    console.warn(`[CIQUAL] Falha: ${err.message}`)
    return []
  }
}
