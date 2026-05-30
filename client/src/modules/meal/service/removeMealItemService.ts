import { api } from '@/api/axios'

export const removeMealItemService = async (patientId: string, mealId: string, itemId: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/meal/${patientId}/${mealId}/items/${itemId}`)
  return data
}
