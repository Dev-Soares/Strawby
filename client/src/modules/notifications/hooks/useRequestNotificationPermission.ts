import { useMutation } from '@tanstack/react-query'
import { requestNotificationPermissionService } from '../service/requestNotificationPermissionService'
import { saveNotificationTokenService } from '../service/saveNotificationTokenService'

export const useRequestNotificationPermission = () => {
  return useMutation({
    mutationFn: async () => {
      const token = await requestNotificationPermissionService()
      if (token) {
        // O save é chaveado por deviceId: se o FCM rotacionou o token, o backend
        // substitui o registro deste aparelho em vez de criar outro. Não depende
        // mais do localStorage pra limpar o antigo (que sumia no reinstall do PWA).
        await saveNotificationTokenService(token)
        localStorage.setItem('fcm_token', token)
      }
      return token
    },
  })
}
