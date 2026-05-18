import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getPlanMealsService = async (): Promise<Meal[]> => {
  const { data } = await api.get('/meal', { params: { kind: 'PLAN' } })
  return data
}
