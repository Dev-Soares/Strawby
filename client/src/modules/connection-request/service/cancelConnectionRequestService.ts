import { api } from '@/api/axios'

export const cancelConnectionRequestService = async (id: string): Promise<void> => {
  await api.delete(`/connection-request/${id}`)
}
