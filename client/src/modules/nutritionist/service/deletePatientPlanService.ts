import { api } from '@/api/axios'

export const deletePatientPlanService = async (patientId: string): Promise<{ id: string }> => {
  const { data } = await api.delete<{ id: string }>(`/plan/${patientId}`)
  return data
}
