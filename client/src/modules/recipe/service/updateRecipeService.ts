import { api } from '@/api/axios'
import type { Recipe } from '../types/recipe'

export const updateRecipeService = async (patientId: string, id: string, name: string): Promise<Recipe> => {
  const { data } = await api.patch(`/recipe/${patientId}/${id}`, { name })
  return data
}
