import { z } from 'zod'

export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'snack', 'dinner', 'supper'])

export type MealType = z.infer<typeof mealTypeSchema>

export const mealTypeValues = mealTypeSchema.options

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar',
  supper: 'Ceia',
}

export const suggestSnackSchema = z.object({
  mealType: mealTypeSchema.optional(),
  maxResults: z.number().min(1).max(5).optional(),
})

export type SuggestSnackData = z.infer<typeof suggestSnackSchema>

export type MealTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type SuggestedSnackItem = {
  name: string
  quantity: number
  unit: string
  foodId: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type SuggestedSnack = {
  name: string
  mealType: string
  reason: string
  items: SuggestedSnackItem[]
  totals: MealTotals
}

export type SuggestSnackResponse = {
  remaining: MealTotals | null
  options: SuggestedSnack[]
}
