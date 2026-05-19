import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const removeMealRecipeService = async (
  mealId: string,
  recipeId: string,
): Promise<Meal> => {
  const { data } = await api.delete(`/meal/${mealId}/recipes/${recipeId}`)
  return data
}
