import { api } from '@/api/axios'

export const resendVerificationService = async (email: string): Promise<void> => {
  await api.post('/auth/resend-verification', { email })
}
