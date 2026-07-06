import { useEffect, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { logBootstrap, warnBootstrap } from '@/shared/components/BootstrapDiagnostics'

const UPDATE_INTERVAL_MS = 15 * 60 * 1000

export const usePwaAutoUpdate = () => {
  const needRefreshRef = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      warnBootstrap('PWA update', 'serviceWorker não disponível')
      return
    }

    let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined

    try {
      updateSW = registerSW({
        immediate: true,
        onRegisterError: (error: unknown) => {
          warnBootstrap('PWA register error', error instanceof Error ? error.message : String(error))
        },
        onNeedRefresh() {
          needRefreshRef.current = true
        },
      })
      logBootstrap('PWA registerSW chamado')
    } catch (error) {
      warnBootstrap('PWA registerSW falhou', error instanceof Error ? error.message : String(error))
      return
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && needRefreshRef.current) {
        void updateSW?.(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let intervalId: ReturnType<typeof setInterval> | undefined

    navigator.serviceWorker.ready
      .then((registration) => {
        intervalId = setInterval(() => {
          if (registration.installing || !navigator.onLine) return
          void registration.update()
        }, UPDATE_INTERVAL_MS)
      })
      .catch((error: unknown) => {
        warnBootstrap('PWA serviceWorker.ready falhou', error instanceof Error ? error.message : String(error))
      })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])
}
