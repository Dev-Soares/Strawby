import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getMealService = async (id: string): Promise<Meal> => {
  const { data } = await api.get(`/meal/${id}`)
  return data
}
