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
  date: string
  userId: string
  mealType: string | null
  time: string | null
  items: MealItem[]
  totals: MealTotals
}
