import { api } from '@/api/axios'
import type { UserPublic } from '../types/user'

export type UpdateUserPayload = {
  name?: string
  email?: string
  weight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female'
}

export const updateUserService = async (id: string, data: UpdateUserPayload): Promise<UserPublic> => {
  const { data: response } = await api.patch<UserPublic>(`/user/${id}`, data)
  return response
}
