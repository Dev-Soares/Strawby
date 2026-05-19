import { api } from '@/api/axios'

export const removeRecipeItemService = async (
  recipeId: string,
  itemId: string,
): Promise<{ id: string }> => {
  const { data } = await api.delete(`/recipe/${recipeId}/items/${itemId}`)
  return data
}
