import { api } from '@/api/axios'

export const deletePlanService = async (): Promise<{ id: string }> => {
  const { data } = await api.delete<{ id: string }>('/plan')
  return data
}
