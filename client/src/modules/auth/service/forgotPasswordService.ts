import { api } from '@/api/axios'

export const forgotPasswordService = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email })
}
