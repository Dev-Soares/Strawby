import { api } from '@/api/axios'
import type { Recipe } from '../types/recipe'

export const getRecipeService = async (id: string): Promise<Recipe> => {
  const { data } = await api.get(`/recipe/${id}`)
  return data
}
