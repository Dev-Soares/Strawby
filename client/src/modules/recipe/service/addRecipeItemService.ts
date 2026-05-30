import { api } from '@/api/axios'
import type { AddRecipeItemData } from '../types/addRecipeItem'
import type { FoodItem } from '../types/recipe'

export const addRecipeItemService = async (patientId: string, recipeId: string, dto: AddRecipeItemData): Promise<FoodItem> => {
  const { data } = await api.post(`/recipe/${patientId}/${recipeId}/items`, dto)
  return data
}
