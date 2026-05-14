import { api } from '@/api/axios'
import type { CreateMealPayload } from '../types/createMeal'
import type { Meal } from '../types/meal'

export const createMealService = async (dto: CreateMealPayload): Promise<Meal> => {
  const { data } = await api.post('/meal', dto)
  return data
}
