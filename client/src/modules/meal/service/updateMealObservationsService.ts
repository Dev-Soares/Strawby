import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const updateMealObservationsService = async (
  patientId: string,
  mealId: string,
  observations: string | null,
): Promise<Meal> => {
  const { data } = await api.patch(`/meal/${patientId}/${mealId}`, { observations })
  return data
}
