import { api } from '@/api/axios'
import type { CreatePrivateFoodData, PrivateFood } from '../types/privateFood'

export const createPrivateFoodService = async (patientId: string, dto: CreatePrivateFoodData): Promise<PrivateFood> => {
  const { data } = await api.post(`/private-food/${patientId}`, dto)
  return data
}
