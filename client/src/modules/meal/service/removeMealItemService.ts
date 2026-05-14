import { api } from '@/api/axios'

export const removeMealItemService = async (
  mealId: string,
  itemId: string,
): Promise<{ id: string }> => {
  const { data } = await api.delete(`/meal/${mealId}/items/${itemId}`)
  return data
}
