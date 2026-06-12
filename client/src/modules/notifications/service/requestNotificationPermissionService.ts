import { getToken } from 'firebase/messaging'
import { messaging } from '@/lib/firebase/firebase'

// Mesmo scope que o SDK do FCM usa por padrão — register() reaproveita a registration existente
const FCM_SW_SCOPE = '/firebase-cloud-messaging-push-scope'

export const requestNotificationPermissionService = async (): Promise<string | null> => {
  if (!('Notification' in window)) return null

  const permission = await Notification.requestPermission()

  if (permission !== 'granted') return null

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

  const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: FCM_SW_SCOPE,
  })
  // scope sem páginas = worker novo ativa direto; sem isso o Chrome só checa a cada ~24h
  await swRegistration.update().catch(() => {})

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: swRegistration,
  })

  return token ?? null
}
