import { api } from '@/api/axios'

export const makeConnectionRequestService = async (code: string): Promise<void> => {
  await api.post('/connection-request', { code })
}
