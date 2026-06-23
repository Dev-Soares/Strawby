import { api } from '@/api/axios'
import type { FoodItem } from '../types/meal'

export const updateMealItemService = async (
  patientId: string,
  mealId: string,
  itemId: string,
  quantity: number,
): Promise<FoodItem> => {
  const { data } = await api.patch(`/meal/${patientId}/${mealId}/items/${itemId}`, { quantity })
  return data
}
