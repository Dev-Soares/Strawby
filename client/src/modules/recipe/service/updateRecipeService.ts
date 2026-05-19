import { api } from '@/api/axios'
import type { Recipe } from '../types/recipe'

export const updateRecipeService = async (
  id: string,
  name: string,
): Promise<Recipe> => {
  const { data } = await api.patch(`/recipe/${id}`, { name })
  return data
}
