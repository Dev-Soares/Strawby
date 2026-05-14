import { api } from '@/api/axios'

export const deleteMealService = async (id: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/meal/${id}`)
  return data
}
