import { api } from '@/api/axios'
import type { CreatePrivateFoodData, PrivateFood } from '../types/privateFood'

export const createPrivateFoodService = async (
  dto: CreatePrivateFoodData,
): Promise<PrivateFood> => {
  const { data } = await api.post('/private-food', dto)
  return data
}
