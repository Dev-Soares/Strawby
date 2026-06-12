import { api } from '@/api/axios'

export const saveNotificationTokenService = async (token: string): Promise<void> => {
  await api.post('/notification/token', { token })
}
