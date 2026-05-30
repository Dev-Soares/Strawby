import { api } from '@/api/axios'

export type UserPublic = {
  id: string
  name: string
  email: string
  role: 'patient' | 'nutritionist'
}

export const getMeService = async (): Promise<UserPublic | null> => {
  const { data } = await api.get<UserPublic | null>('/user/me')
  return data
}
