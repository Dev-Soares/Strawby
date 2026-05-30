import { api } from '@/api/axios'

export const removeRecipeItemService = async (patientId: string, recipeId: string, itemId: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/recipe/${patientId}/${recipeId}/items/${itemId}`)
  return data
}
