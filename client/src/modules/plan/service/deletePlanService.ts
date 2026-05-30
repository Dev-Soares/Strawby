import { api } from '@/api/axios'

export const deletePlanService = async (patientId: string): Promise<{ id: string }> => {
  const { data } = await api.delete<{ id: string }>(`/plan/${patientId}`)
  return data
}
