import { api } from '@/api/axios'
import type { CreateRecipeData } from '../types/createRecipe'
import type { Recipe } from '../types/recipe'

export const createRecipeService = async (patientId: string, dto: CreateRecipeData): Promise<Recipe> => {
  const { data } = await api.post(`/recipe/${patientId}`, dto)
  return data
}
