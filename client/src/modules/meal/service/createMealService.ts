import { api } from '@/api/axios'
import type { CreateMealData } from '../types/createMeal'
import type { Meal } from '../types/meal'

export const createMealService = async (dto: CreateMealData): Promise<Meal> => {
  const { data } = await api.post('/meal', dto)
  return data
}
