import { useEffect, useRef } from 'react'
import { registerSW } from 'virtual:pwa-register'

const UPDATE_INTERVAL_MS = 15 * 60 * 1000

export const usePwaAutoUpdate = () => {
  const needRefreshRef = useRef(false)

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onRegisterError: (error: unknown) => {
        console.error('Falha ao registrar o service worker:', error)
      },
      onNeedRefresh() {
        needRefreshRef.current = true
      },
    })

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && needRefreshRef.current) {
        void updateSW(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined

    navigator.serviceWorker?.ready.then((registration) => {
      intervalId = setInterval(() => {
        if (registration.installing || !navigator.onLine) return
        void registration.update()
      }, UPDATE_INTERVAL_MS)
    })

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])
}
