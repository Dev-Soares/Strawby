import { deleteToken, getToken } from 'firebase/messaging'
import { getMessagingInstance } from '@/lib/firebase/firebase'

/** Retorna o token atual do FCM (se houver) e invalida a subscription do aparelho. */
export const revokeNotificationPermissionService = async (): Promise<string | null> => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return null

  const messaging = await getMessagingInstance()
  if (!messaging) return null

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

  const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/firebase-cloud-messaging-push-scope',
  })

  let token: string | null = null
  try {
    token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: swRegistration })
  } catch {
    token = null
  }

  await deleteToken(messaging).catch(() => {})

  return token
}
