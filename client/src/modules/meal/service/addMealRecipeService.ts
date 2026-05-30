import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export type AddMealRecipeData = {
  recipeId: string
}

export const addMealRecipeService = async (patientId: string, mealId: string, dto: AddMealRecipeData): Promise<Meal> => {
  const { data } = await api.post(`/meal/${patientId}/${mealId}/recipes`, dto)
  return data
}
