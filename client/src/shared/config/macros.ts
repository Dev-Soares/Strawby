export type MacroField = 'protein' | 'carbs' | 'fat'

export type MacroConfig = {
  field: MacroField
  label: string
  /** Rótulo abreviado — usado em chips e espaços estreitos */
  short: string
  unit: string
  /** Calorias por grama — usado no cálculo de distribuição do plano */
  kcalPerGram: number
  /** Limite máximo em gramas — espelha os limites do planSchema */
  max: number
  step: number
  color: string
  track: string
  bg: string
  border: string
  textColor: string
  ringFocus: string
  /** Borda inferior do input: estado normal + foco */
  inputBorder: string
}

export const MACROS: MacroConfig[] = [
  {
    field: 'protein',
    label: 'Proteína',
    short: 'Prot',
    unit: 'g',
    kcalPerGram: 4,
    max: 500,
    step: 5,
    color: '#f59e0b',
    track: '#fef3c7',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-100 dark:border-amber-900/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    ringFocus: 'focus:ring-amber-300',
    inputBorder: 'border-amber-300/60 focus:border-amber-500',
  },
  {
    field: 'carbs',
    label: 'Carboidratos',
    short: 'Carb',
    unit: 'g',
    kcalPerGram: 4,
    max: 800,
    step: 5,
    color: '#3b82f6',
    track: '#dbeafe',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-100 dark:border-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    ringFocus: 'focus:ring-blue-300',
    inputBorder: 'border-blue-300/60 focus:border-blue-500',
  },
  {
    field: 'fat',
    label: 'Gordura',
    short: 'Gord',
    unit: 'g',
    kcalPerGram: 9,
    max: 300,
    step: 5,
    color: '#a855f7',
    track: '#f3e8ff',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-100 dark:border-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    ringFocus: 'focus:ring-purple-300',
    inputBorder: 'border-purple-300/60 focus:border-purple-500',
  },
]

export const getMacro = (field: MacroField): MacroConfig =>
  MACROS.find((m) => m.field === field) ?? MACROS[0]

export type NutrientField = 'calories' | MacroField

/** Calorias + macros — para telas que exibem os quatro juntos */
export const CALORIES = {
  field: 'calories' as const,
  label: 'Calorias',
  short: 'Kcal',
  unit: 'kcal',
  color: '#ef4444',
  track: '#fee2e2',
}

export const NUTRIENTS = [CALORIES, ...MACROS]
