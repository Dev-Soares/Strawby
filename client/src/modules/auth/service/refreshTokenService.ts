import { api } from '@/api/axios'

export const refreshTokenService = async (): Promise<void> => {
  await api.post('/auth/refresh')
}
