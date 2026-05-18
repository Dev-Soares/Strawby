import { api } from '@/api/axios'
import type { AddMealPrivateFoodItemData } from '../types/addMealPrivateFoodItem'
import type { MealItem } from '../types/meal'

export const addMealPrivateFoodItemService = async (
  mealId: string,
  dto: AddMealPrivateFoodItemData,
): Promise<MealItem> => {
  const { data } = await api.post(`/meal/${mealId}/private-items`, dto)
  return data
}
