import { api } from '@/api/axios'
import type { AddRecipeItemData } from '../types/addRecipeItem'
import type { FoodItem } from '../types/recipe'

export const addRecipeItemService = async (
  recipeId: string,
  dto: AddRecipeItemData,
): Promise<FoodItem> => {
  const { data } = await api.post(`/recipe/${recipeId}/items`, dto)
  return data
}
