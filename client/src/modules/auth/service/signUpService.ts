import { api } from '@/api/axios'
import type { SignUpData } from '../types/signUp'

export const TERMS_VERSION = '1.0'

export const signUpService = async (data: SignUpData): Promise<{ id: string; name: string; email: string; role: string }> => {
  const { confirmPassword: _, acceptTerms: __, ...rest } = data
  const payload = { ...rest, termsVersion: TERMS_VERSION }
  const { data: response } = await api.post('/user', payload)
  return response
}
