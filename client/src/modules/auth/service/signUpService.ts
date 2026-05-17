import { api } from '@/api/axios'
import type { SignUpData } from '../types/signUp'

export const signUpService = async (data: SignUpData): Promise<{ id: string; name: string; email: string }> => {
  const { confirmPassword: _, ...payload } = data
  const { data: response } = await api.post('/user', payload)
  return response
}
