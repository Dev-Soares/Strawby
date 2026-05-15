import { api } from '@/api/axios'

export const deletePlanMealService = async (id: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/plan-meal/${id}`)
  return data
}
