import { api } from '@/api/axios'
import type { PrivateFood } from '../types/privateFood'

export const deletePrivateFoodService = async (id: string): Promise<PrivateFood> => {
  const { data } = await api.delete(`/private-food/${id}`)
  return data
}
