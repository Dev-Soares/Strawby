export type RecipeTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type FoodItem = {
  id: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
  food: {
    id: string
    name: string
  } | null
  privateFood: {
    id: string
    name: string
  } | null
}

export type Recipe = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  userId: string
  createdAt: string
  updatedAt: string
  items: FoodItem[]
  totals: RecipeTotals
}

export type RecipeSummary = Omit<Recipe, 'items' | 'createdAt' | 'updatedAt'>
