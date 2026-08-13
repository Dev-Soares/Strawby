import { MACROS, type MacroField } from '@/shared/config/macros'

export type MacroValues = Record<MacroField, number>

/** Total de calorias que os macros somam, usando kcal/g de cada um */
export const macroKcalTotal = (values: MacroValues): number =>
  MACROS.reduce((acc, m) => acc + (Number(values[m.field]) || 0) * m.kcalPerGram, 0)

/** Participação de um macro no total calórico, em % inteiro */
export const macroKcalShare = (field: MacroField, values: MacroValues): number => {
  const total = macroKcalTotal(values)
  if (total <= 0) return 0
  const macro = MACROS.find((m) => m.field === field)
  if (!macro) return 0
  return Math.round((((Number(values[field]) || 0) * macro.kcalPerGram) / total) * 100)
}

/**
 * Carboidrato é o macro de equilíbrio: preenche as calorias restantes
 * depois de proteína e gordura. Nunca negativo.
 */
export const balanceCarbs = (calories: number, protein: number, fat: number): number | null => {
  const c = Number(calories)
  const p = Number(protein)
  const f = Number(fat)
  if (!Number.isFinite(c) || !Number.isFinite(p) || !Number.isFinite(f)) return null

  const proteinKcal = MACROS.find((m) => m.field === 'protein')!.kcalPerGram
  const fatKcal = MACROS.find((m) => m.field === 'fat')!.kcalPerGram
  const carbsKcal = MACROS.find((m) => m.field === 'carbs')!.kcalPerGram

  return Math.max(Math.round((c - p * proteinKcal - f * fatKcal) / carbsKcal), 0)
}

/** Percentual atingido de uma meta, limitado a 0–100 */
export const goalPct = (actual: number, goal: number): number =>
  goal > 0 ? Math.min(Math.round((actual / goal) * 100), 100) : 0

/**
 * Progresso rumo a uma meta de peso, em 0–100.
 * Funciona nas duas direções (perder ou ganhar peso).
 */
export const weightGoalProgress = (start: number, current: number, target: number): number => {
  // Já estava na meta ao começar — nada a percorrer
  if (start === target) return 100
  const walked = (start - current) / (start - target)
  return Math.min(Math.max(walked * 100, 0), 100)
}
