import { useEffect } from 'react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useRequestNotificationPermission } from './useRequestNotificationPermission'

/**
 * Re-registra o token FCM a cada abertura do app (usuário logado e com
 * notificações ativas). Subscriptions morrem silenciosamente (iOS reinstala
 * PWA, rotação do FCM) — isso recria o token e atualiza o banco sozinho.
 */
export const useRefreshNotificationToken = () => {
  const { data: user } = useAuth()
  const { mutate } = useRequestNotificationPermission()
  const userId = user?.id

  useEffect(() => {
    if (!userId) return
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return
    // sem token guardado = usuário desativou o toggle — respeita o opt-out
    if (!localStorage.getItem('fcm_token')) return

    mutate(undefined)
  }, [userId, mutate])
}
