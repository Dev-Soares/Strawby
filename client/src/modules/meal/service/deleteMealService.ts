import { api } from '@/api/axios'

export const deleteMealService = async (patientId: string, id: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/meal/${patientId}/${id}`)
  return data
}
