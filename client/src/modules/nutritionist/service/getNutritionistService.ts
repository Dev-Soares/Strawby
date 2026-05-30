import { api } from '@/api/axios'
import type { Nutritionist } from '../types/nutritionist'

export const getNutritionistService = async (): Promise<Nutritionist> => {
  const { data } = await api.get<Nutritionist>('/nutritionist/me')
  return data
}
