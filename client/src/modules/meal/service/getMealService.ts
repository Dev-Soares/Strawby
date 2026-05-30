import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getMealService = async (patientId: string, id: string): Promise<Meal> => {
  const { data } = await api.get(`/meal/${patientId}/${id}`)
  return data
}
