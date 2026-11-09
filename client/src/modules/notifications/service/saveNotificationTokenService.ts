import { api } from '@/api/axios'
import { getDeviceId } from '@/shared/utils/deviceId'

export const saveNotificationTokenService = async (token: string): Promise<void> => {
  await api.post('/notification/token', { token, deviceId: getDeviceId() })
}
