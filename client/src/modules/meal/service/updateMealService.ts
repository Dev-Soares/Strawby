import { api } from '@/api/axios'
import type { Meal } from '../types/meal'
import type { UpdateMealPayload } from '../types/updateMeal'

export const updateMealService = async (
  patientId: string,
  mealId: string,
  body: UpdateMealPayload,
): Promise<Meal> => {
  const { data } = await api.patch(`/meal/${patientId}/${mealId}`, body)
  return data
}
