export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'

export interface MealFood {
  name: string
  grams: number
  kcal: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: string
  name: string
  mealType: MealType
  foods: MealFood[]
  time: string
  kcal: number
}
