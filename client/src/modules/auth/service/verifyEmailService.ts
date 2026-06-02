import { api } from '@/api/axios'

export const verifyEmailService = async (token: string): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/verify-email', { token })
  return data
}
