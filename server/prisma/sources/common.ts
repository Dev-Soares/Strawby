export interface FoodEntry {
  name: string
  nameOriginal: string | null
  source: 'TACO' | 'USDA_FOUNDATION' | 'USDA_SR_LEGACY' | 'CNF' | 'LIVS' | 'OFF' | 'MANUAL'
  sourceId: string | null
  category: string | null
  priority: number
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
    const t = val.trim()
    if (t === '' || t === 'NA' || t === 'Tr' || t === 'tr') return 0
    const p = parseFloat(t.replace(',', '.'))
    return isNaN(p) || p < 0 ? 0 : p
  }
  if (typeof val === 'number') return isNaN(val) || val < 0 ? 0 : val
  return 0
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

const JUNK_ALWAYS = [
  /[*|[\]{}\\<>]/,
  /\d+(ml|kg|mg|kcal|cal)\b/i,
  /^\d/,
  /https?:\/\/|www\./,
  /\b(babyfood|baby food|infant formula)\b/i,
]

// Strict: para OFF e fontes de qualidade desconhecida
export function isValidFoodName(name: string): boolean {
  if (!name || name.length < 3 || name.length > 100) return false
  if (name.split(/\s+/).length > 10) return false
  if (/[%@#]/.test(name)) return false
  if (name.length > 5 && name === name.toUpperCase()) return false
  if (/ - /.test(name)) return false
  if (/[,;].*[,;].*[,;].*[,;]/.test(name)) return false
  if (/\b(NFS|NS as to)\b/i.test(name)) return false
  for (const p of JUNK_ALWAYS) if (p.test(name)) return false
  return true
}

// Loose: para USDA/CNF/LIVS — convenções científicas, vírgulas e hífens são normais
export function isValidFoodNameLoose(name: string): boolean {
  if (!name || name.length < 2 || name.length > 200) return false
  if (name.split(/\s+/).length > 20) return false
  if (/[%@#]/.test(name)) return false
  // Rejeita se for só números/pontuação
  if (!/[a-zA-ZÀ-ú]/.test(name)) return false
  // Rejeita nomes que são claramente códigos
  if (/^\s*[A-Z0-9]{6,}\s*$/.test(name)) return false
  for (const p of JUNK_ALWAYS) if (p.test(name)) return false
  return true
}

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
    if (ratio > 0.4) return false
  }
  if (calories > 950) return false
  return true
}

// Remove lixo USDA/FNDDS antes de traduzir
export function cleanUsdaJunk(name: string): string {
  return name
    .replace(/\s*\(Includes [^)]*USDA[^)]*\)/gi, '')
    .replace(/\s*\(Includes alimentos[^)]*\)/gi, '')
    .replace(/\s*\(NDB[^)]*\)/gi, '')
    .replace(/\s*\(USDA[^)]*\)/gi, '')
    .replace(/,?\s*NS as to[^,;]*/gi, '')
    .replace(/,?\s*NFS\b/gi, '')
    .replace(/,?\s*not further specified/gi, '')
    .replace(/,?\s*type unspecified/gi, '')
    .replace(/,?\s*brand not specified/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/,\s*$/, '')
    .trim()
}

// Normalização para deduplicação cross-source
export function normalizeForCompare(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
