import { getToken } from 'firebase/messaging'
import { messaging } from '@/lib/firebase/firebase'

export const requestNotificationPermissionService = async (): Promise<string | null> => {
  if (!('Notification' in window)) return null

  const permission = await Notification.requestPermission()
  
  if (permission !== 'granted') return null

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

  const allRegs = await navigator.serviceWorker.getRegistrations()
  const swRegistration = allRegs.find(r => r.active?.scriptURL?.includes('firebase-messaging-sw'))

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: swRegistration,
  })

  return token ?? null
}
