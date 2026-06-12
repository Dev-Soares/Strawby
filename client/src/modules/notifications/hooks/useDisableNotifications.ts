import { useMutation } from '@tanstack/react-query'
import { deleteNotificationTokenService } from '../service/deleteNotificationTokenService'

export const useDisableNotifications = () => {
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('fcm_token')
      if (token) {
        await deleteNotificationTokenService(token)
        localStorage.removeItem('fcm_token')
      }
    },
  })
}
