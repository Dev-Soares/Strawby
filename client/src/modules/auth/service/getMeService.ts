import { api } from '@/api/axios'
import type { UserPublic } from '../types/user'

export const getMeService = async (): Promise<UserPublic | null> => {
  const { data } = await api.get<UserPublic | null>('/user/me')
  return data
}
