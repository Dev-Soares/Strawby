import { api } from '@/api/axios'
import type { UpdatePrivateFoodData, PrivateFood } from '../types/privateFood'

export const updatePrivateFoodService = async (
  id: string,
  dto: UpdatePrivateFoodData,
): Promise<PrivateFood> => {
  const { data } = await api.patch(`/private-food/${id}`, dto)
  return data
}
