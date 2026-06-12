import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signOutService } from '../service/signOutService'
import { deleteNotificationTokenService } from '@/modules/notifications/service/deleteNotificationTokenService'
import { revokeNotificationPermissionService } from '@/modules/notifications/service/revokeNotificationPermissionService'

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // token real pode divergir do localStorage (rotação do FCM) — limpa ambos antes de sair
      const storedToken = localStorage.getItem('fcm_token')
      const currentToken = await revokeNotificationPermissionService().catch(() => null)

      const tokens = [...new Set([storedToken, currentToken])].filter((t): t is string => !!t)
      await Promise.all(tokens.map((t) => deleteNotificationTokenService(t).catch(() => {})))

      localStorage.removeItem('fcm_token')
      return signOutService()
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user', 'me'] })
      navigate('/app/login')
    },
    onError: () => {
      toast.error('Erro ao sair')
    },
  })
}
