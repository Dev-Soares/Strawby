// Tipos e helpers compartilhados entre todos os loaders de fonte.

export interface FoodEntry {
  name: string                // nome em PT-BR (traduzido se vier de fora)
  nameOriginal: string | null // nome original (EN/SV/etc) — null se TACO
  source: 'TACO' | 'USDA_FOUNDATION' | 'USDA_SR_LEGACY' | 'CNF' | 'LIVS' | 'OFF' | 'MANUAL'
  sourceId: string | null     // ID original (TACO id, USDA fdcId, CNF FoodID, etc)
  category: string | null
  priority: number            // TACO=100, FOUNDATION=80, CNF=70, SR_LEGACY=60, LIVS=50, OFF=40
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number | null
  sodium: number | null
}

export function round2(val: number): number {
  return Math.round(val * 100) / 100
}

export function safeNum(val: unknown): number {
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (trimmed === '' || trimmed === 'NA' || trimmed === 'Tr' || trimmed === 'tr') return 0
    const parsed = parseFloat(trimmed.replace(',', '.'))
    return isNaN(parsed) || parsed < 0 ? 0 : parsed
  }
  if (typeof val === 'number') return isNaN(val) || val < 0 ? 0 : val
  return 0
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Filtros qualidade nome — aplicados em todas fontes externas (não TACO).
const FOREIGN_BRAND_PATTERN = /\b(NFS|NS as to|babyfood|baby food|infant formula|restaurant)\b/i

export function isValidFoodName(name: string): boolean {
  if (!name) return false
  if (name.length < 3 || name.length > 100) return false
  if (name.split(/\s+/).length > 10) return false
  if (/[%*|#@[\]{}\\<>]/.test(name)) return false
  if (/\d+(g|ml|kg|l\b|mg|kcal|cal)\b/i.test(name)) return false
  if (/^\d/.test(name)) return false
  if (name.length > 5 && name === name.toUpperCase()) return false
  if (/ - /.test(name)) return false
  if (/[,;].*[,;].*[,;].*[,;]/.test(name)) return false // 4+ vírgulas = lista
  if (/https?:\/\/|www\./.test(name)) return false
  if (FOREIGN_BRAND_PATTERN.test(name)) return false
  return true
}

// Validação plausibilidade nutricional (por 100g).
export function isNutritionPlausible(
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
): boolean {
  const totalMacros = protein + carbs + fat
  if (totalMacros > 105) return false
  const estimated = protein * 4 + carbs * 4 + fat * 9
  if (calories > 10 && estimated > 10) {
    const ratio = Math.abs(calories - estimated) / calories
    if (ratio > 0.4) return false // 40% tolerância (fibra, álcool, polióis afetam)
  }
  // Calorias absurdas
  if (calories > 950) return false
  return true
}

// Remove sufixos verbosos USDA tipo "(Includes foods for USDA's food Distribution Program)".
export function cleanUsdaJunk(name: string): string {
  return name
    .replace(/\s*\(Includes [^)]*USDA[^)]*\)/gi, '')
    .replace(/\s*\(Includes alimentos[^)]*\)/gi, '')
    .replace(/\s*\(NDB[^)]*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Normalização para deduplicação cross-source.
export function normalizeForCompare(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
