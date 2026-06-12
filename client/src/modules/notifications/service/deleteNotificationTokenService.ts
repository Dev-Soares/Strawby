import { api } from '@/api/axios'

export const deleteNotificationTokenService = async (token: string): Promise<void> => {
  await api.delete('/notification/token', { data: { token } })
}
