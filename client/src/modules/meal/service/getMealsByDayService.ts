import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getMealsByDayService = async (patientId: string, day: string): Promise<Meal[]> => {
  const { data } = await api.get(`/meal/${patientId}/day/${day}`, { params: { kind: 'DAILY' } })
  return data
}
