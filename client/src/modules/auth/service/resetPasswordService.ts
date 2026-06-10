import { api } from '@/api/axios'

export const resetPasswordService = async (token: string, newPassword: string): Promise<void> => {
  await api.post('/auth/reset-password', { token, newPassword })
}
