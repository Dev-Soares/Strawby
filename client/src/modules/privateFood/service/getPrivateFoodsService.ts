import { api } from '@/api/axios'
import type { PrivateFood } from '../types/privateFood'

export const getPrivateFoodsService = async (): Promise<PrivateFood[]> => {
  const { data } = await api.get('/private-food')
  return data
}
