import { api } from '@/api/axios'
import type { UpdatePrivateFoodData, PrivateFood } from '../types/privateFood'

export const updatePrivateFoodService = async (patientId: string, id: string, dto: UpdatePrivateFoodData): Promise<PrivateFood> => {
  const { data } = await api.patch(`/private-food/${patientId}/${id}`, dto)
  return data
}
