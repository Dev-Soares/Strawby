import { useMutation } from '@tanstack/react-query'
import { requestNotificationPermissionService } from '../service/requestNotificationPermissionService'
import { saveNotificationTokenService } from '../service/saveNotificationTokenService'
import { deleteNotificationTokenService } from '../service/deleteNotificationTokenService'

export const useRequestNotificationPermission = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await requestNotificationPermissionService()
      if (token) {
        const previousToken = localStorage.getItem('fcm_token')
        if (previousToken && previousToken !== token) {
          // FCM rotacionou o token — remove o antigo do banco pra não entregar em dobro
          await deleteNotificationTokenService(previousToken).catch(() => {})
        }
        await saveNotificationTokenService(token)
        localStorage.setItem('fcm_token', token)
      }
      return token
    },
  })
}
