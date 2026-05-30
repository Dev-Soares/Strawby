import { api } from '@/api/axios'
import type { Recipe } from '../types/recipe'

export const getRecipesService = async (patientId: string): Promise<Recipe[]> => {
  const { data } = await api.get(`/recipe/${patientId}`)
  return data
}
