import { api } from '@/api/axios'
import type { PrivateFood } from '../types/privateFood'

export const deletePrivateFoodService = async (patientId: string, id: string): Promise<PrivateFood> => {
  const { data } = await api.delete(`/private-food/${patientId}/${id}`)
  return data
}
