import { api } from '@/api/axios'

export const rejectConnectionRequestService = async (id: string): Promise<void> => {
  await api.patch(`/connection-request/${id}/reject`)
}
