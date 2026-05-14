import { api } from '@/api/axios'
import type { SignUpData } from '../types/signUp'

export const signUpService = async (data: SignUpData): Promise<{ id: string; name: string; email: string }> => {
  const { data: response } = await api.post('/user', data)
  return response
}
