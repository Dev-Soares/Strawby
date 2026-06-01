import { api } from '@/api/axios'

export const deleteUserService = async (id: string): Promise<void> => {
  await api.delete(`/user/${id}`)
}
