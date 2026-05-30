import { api } from '@/api/axios'
import type { CreateMealData } from '../types/createMeal'
import type { Meal } from '../types/meal'

export const createMealService = async (patientId: string, dto: CreateMealData): Promise<Meal> => {
  const { data } = await api.post(`/meal/${patientId}`, dto)
  return data
}
