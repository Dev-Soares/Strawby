import { api } from '@/api/axios'

export const verifyEmailService = async (token: string): Promise<void> => {
  await api.get('/auth/verify-email', { params: { token } })
}
