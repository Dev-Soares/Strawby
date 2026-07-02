import { api } from '@/api/axios'
import type { ConnectionRequest } from '../types/connectionRequest'

export const getConnectionRequestHistoryService = async (): Promise<ConnectionRequest[]> => {
  const { data } = await api.get<ConnectionRequest[]>('/connection-request/nutritionist/history')
  return data
}
