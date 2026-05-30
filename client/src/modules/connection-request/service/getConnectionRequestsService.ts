import { api } from '@/api/axios'
import type { ConnectionRequest } from '../types/connectionRequest'

export const getConnectionRequestsService = async (): Promise<ConnectionRequest[]> => {
  const { data } = await api.get<ConnectionRequest[]>('/connection-request/nutritionist')
  return data
}
