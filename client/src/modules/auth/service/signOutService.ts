import { api } from '@/api/axios'

export const signOutService = async (): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/logout')
  return data
}
