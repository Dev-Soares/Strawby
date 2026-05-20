import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export type AddMealRecipeData = {
  recipeId: string
}

export const addMealRecipeService = async (
  mealId: string,
  dto: AddMealRecipeData,
): Promise<Meal> => {
  const { data } = await api.post(`/meal/${mealId}/recipes`, dto)
  return data
}
