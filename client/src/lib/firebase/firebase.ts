import type { FirebaseApp } from 'firebase/app'
import type { Messaging } from 'firebase/messaging'
import { firebaseConfig } from './config/firebaseConfig'

let app: FirebaseApp | null = null
let messagingInstance: Messaging | null = null
let initError: Error | null = null
let initPromise: Promise<Messaging | null> | null = null

async function initializeFirebase(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null
  if (messagingInstance) return messagingInstance
  if (initError) return null

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const { initializeApp } = await import('firebase/app')
        app = initializeApp(firebaseConfig)

        try {
          const { getAnalytics } = await import('firebase/analytics')
          getAnalytics(app)
        } catch {
          // Analytics não é essencial e falha em ambientes restritos (ITP, WebView).
        }

        const { getMessaging } = await import('firebase/messaging')
        messagingInstance = getMessaging(app)
        return messagingInstance
      } catch (error) {
        initError = error instanceof Error ? error : new Error(String(error))
        // eslint-disable-next-line no-console
        console.warn('[Firebase] Falha ao inicializar messaging:', initError.message)
        return null
      }
    })()
  }

  return initPromise
}

export function getMessagingInstance(): Promise<Messaging | null> {
  return initializeFirebase()
}
