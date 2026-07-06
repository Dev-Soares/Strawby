import { api } from '@/api/axios'
import type { MyConnectionRequest } from '../types/myConnectionRequest'

export const getMyConnectionRequestsService = async (): Promise<MyConnectionRequest[]> => {
  const { data } = await api.get<MyConnectionRequest[]>('/connection-request/patient')
  return data
}
