import { useMutation } from '@tanstack/react-query'
import { requestNotificationPermissionService } from '../service/requestNotificationPermissionService'
import { saveNotificationTokenService } from '../service/saveNotificationTokenService'

export const useRequestNotificationPermission = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await requestNotificationPermissionService()
      if (token) {
        await saveNotificationTokenService(token)
        localStorage.setItem('fcm_token', token)
      }
      return token
    },
  })
}
