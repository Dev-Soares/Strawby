import { api } from '@/api/axios'
import type { Recipe } from '../types/recipe'

export const getRecipeService = async (patientId: string, id: string): Promise<Recipe> => {
  const { data } = await api.get(`/recipe/${patientId}/${id}`)
  return data
}
