import { useMutation } from '@tanstack/react-query'
import { deleteNotificationTokenService } from '../service/deleteNotificationTokenService'
import { revokeNotificationPermissionService } from '../service/revokeNotificationPermissionService'

export const useDisableNotifications = () => {
  return useMutation({
    mutationFn: async () => {
      // token real pode divergir do localStorage (rotação do FCM) — pega direto da fonte
      const storedToken = localStorage.getItem('fcm_token')
      const currentToken = await revokeNotificationPermissionService()

      const tokens = [...new Set([storedToken, currentToken])].filter((t): t is string => !!t)
      await Promise.all(tokens.map((t) => deleteNotificationTokenService(t).catch(() => {})))

      localStorage.removeItem('fcm_token')
    },
  })
}
