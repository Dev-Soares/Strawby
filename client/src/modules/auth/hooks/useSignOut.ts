import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signOutService } from '../service/signOutService'
import { deleteNotificationTokenService } from '@/modules/notifications/service/deleteNotificationTokenService'

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const fcmToken = localStorage.getItem('fcm_token')
      if (fcmToken) {
        try {
          await deleteNotificationTokenService(fcmToken)
        } catch {
          // ignora erro — logout prossegue de qualquer forma
        }
        localStorage.removeItem('fcm_token')
      }
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
