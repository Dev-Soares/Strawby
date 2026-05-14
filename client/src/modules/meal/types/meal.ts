export type MealKind = 'DAILY' | 'PLAN'

export type MealTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type MealItem = {
  id: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
  food: {
    id: string
    name: string
  }
}

export type Meal = {
  id: string
  name: string
  kind: MealKind
  mealType: string | null
  time: string | null
  date: string
  userId: string
  items: MealItem[]
  totals: MealTotals
}

export type MealSummary = Omit<Meal, 'items'>
