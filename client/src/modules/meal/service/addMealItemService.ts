import { api } from '@/api/axios'
import type { AddMealItemData } from '../types/addMealItem'
import type { FoodItem } from '../types/meal'

export const addMealItemService = async (
  mealId: string,
  dto: AddMealItemData,
): Promise<FoodItem> => {
  const { data } = await api.post(`/meal/${mealId}/items`, dto)
  return data
}
