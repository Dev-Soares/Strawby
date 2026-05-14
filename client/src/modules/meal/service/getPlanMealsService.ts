import { api } from '@/api/axios'
import type { MealSummary } from '../types/meal'

export const getPlanMealsService = async (): Promise<MealSummary[]> => {
  const { data } = await api.get('/meal', { params: { kind: 'PLAN' } })
  return data
}
