import { api } from '@/api/axios'

export const googleSignInService = async (credential: string): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/google', { credential })
  return data
}
