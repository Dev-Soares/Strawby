import { api } from '@/api/axios'

export const googleSignInService = async (
  code: string,
  redirectUri: string,
): Promise<{ message: string }> => {
  const { data } = await api.post('/auth/google', { code, redirectUri })
  return data
}
