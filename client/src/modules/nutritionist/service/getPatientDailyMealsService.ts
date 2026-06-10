import { api } from '@/api/axios'
import type { Meal } from '../../meal/types/meal'

export const getPatientDailyMealsService = async (patientId: string, day: string): Promise<Meal[]> => {
  const { data } = await api.get<Meal[]>(`/meal/${patientId}/day/${day}`, { params: { kind: 'DAILY' } })
  return data
}
