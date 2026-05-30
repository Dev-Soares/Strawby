import { api } from '@/api/axios'
import type { AddRecipePrivateFoodItemData } from '../types/addRecipePrivateFoodItem'
import type { FoodItem } from '../types/recipe'

export const addRecipePrivateFoodItemService = async (patientId: string, recipeId: string, dto: AddRecipePrivateFoodItemData): Promise<FoodItem> => {
  const { data } = await api.post(`/recipe/${patientId}/${recipeId}/private-items`, dto)
  return data
}
