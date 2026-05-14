export type PlanMealTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type PlanMealItem = {
  id: string
  quantity: number
  food: {
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export type PlanMeal = {
  id: string
  name: string
  type: string | null
  date: string
  userId: string
  items: PlanMealItem[]
  totals: PlanMealTotals
}

export type PlanMealSummary = {
  id: string
  name: string
  type: string | null
  date: string
  userId: string
  totals: PlanMealTotals
}
