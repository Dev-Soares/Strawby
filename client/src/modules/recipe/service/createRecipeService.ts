import { api } from '@/api/axios'
import type { CreateRecipeData } from '../types/createRecipe'
import type { Recipe } from '../types/recipe'

export const createRecipeService = async (dto: CreateRecipeData): Promise<Recipe> => {
  const { data } = await api.post('/recipe', dto)
  return data
}
