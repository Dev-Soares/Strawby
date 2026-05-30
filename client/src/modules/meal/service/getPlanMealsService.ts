import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getPlanMealsService = async (patientId: string): Promise<Meal[]> => {
  const { data } = await api.get(`/meal/${patientId}`, { params: { kind: 'PLAN' } })
  return data
}
