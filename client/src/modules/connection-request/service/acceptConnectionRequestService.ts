import { api } from '@/api/axios'

export const acceptConnectionRequestService = async (id: string): Promise<void> => {
  await api.patch(`/connection-request/${id}/accept`)
}
