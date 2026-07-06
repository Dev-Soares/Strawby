import { useEffect, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'

const UPDATE_INTERVAL_MS = 15 * 60 * 1000

export const usePwaAutoUpdate = () => {
  const needRefreshRef = useRef(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined

    try {
      updateSW = registerSW({
        immediate: true,
        onRegisterError: () => {},
        onNeedRefresh() {
          needRefreshRef.current = true
        },
      })
    } catch {
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
      .catch(() => {})

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])
}
