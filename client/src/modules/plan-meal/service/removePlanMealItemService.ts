import { api } from '@/api/axios'

export const removePlanMealItemService = async (
  planMealId: string,
  itemId: string,
): Promise<{ id: string }> => {
  const { data } = await api.delete(`/plan-meal/${planMealId}/items/${itemId}`)
  return data
}
