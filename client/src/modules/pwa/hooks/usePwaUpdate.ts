import { useCallback, useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

const CHECK_INTERVAL_MS = 15 * 60 * 1000
// Tempo em background que torna seguro recarregar sem avisar: o usuário saiu do app.
const BACKGROUND_AUTO_APPLY_MS = 20 * 1000
const RELOAD_GUARD_KEY = 'pwa:reload-guard'
const RELOAD_FALLBACK_MS = 3000

type UpdateSW = (reloadPage?: boolean) => Promise<void>

export const usePwaUpdate = () => {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const updateSWRef = useRef<UpdateSW | null>(null)
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)
  const needRefreshRef = useRef(false)
  const hiddenAtRef = useRef<number | null>(null)

  const applyUpdate = useCallback(() => {
    if (!needRefreshRef.current) return

    // Guarda contra loop de reload caso o SW continue anunciando atualização.
    try {
      if (sessionStorage.getItem(RELOAD_GUARD_KEY)) {
        window.location.reload()
        return
      }
      sessionStorage.setItem(RELOAD_GUARD_KEY, '1')
    } catch {
      // sessionStorage pode estar bloqueado (modo privado restrito).
    }

    setIsUpdating(true)

    // updateSW(true) manda SKIP_WAITING e recarrega no controllerchange.
    // Se o evento não vier, recarrega na força.
    window.setTimeout(() => window.location.reload(), RELOAD_FALLBACK_MS)
    void updateSWRef.current?.(true)
  }, [])

  const dismiss = useCallback(() => setIsDismissed(true), [])

  const markNeedRefresh = useCallback(() => {
    needRefreshRef.current = true
    setNeedRefresh(true)
    setIsDismissed(false)
  }, [])

  // Registro do SW + detecção de versão nova
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    try {
      updateSWRef.current = registerSW({
        immediate: true,
        onRegisterError: () => {},
        onRegisteredSW(_url, registration) {
          registrationRef.current = registration ?? null
        },
        onNeedRefresh: markNeedRefresh,
      })
    } catch {
      // WebViews restritos (ex: Instagram no iOS) bloqueiam service workers.
    }
  }, [markNeedRefresh])

  // Limpa a guarda de reload quando a sessão já subiu com a versão nova
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(RELOAD_GUARD_KEY)
      } catch {
        // ignora
      }
    }, 10_000)

    return () => window.clearTimeout(timeoutId)
  }, [])

  // Checagem periódica + ao voltar pro app + ao reconectar
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const checkForUpdate = () => {
      const registration = registrationRef.current
      if (!registration || registration.installing || !navigator.onLine) return
      void registration.update().catch(() => {})
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now()
        return
      }

      const hiddenAt = hiddenAtRef.current
      hiddenAtRef.current = null

      const wasAwayLongEnough = hiddenAt !== null && Date.now() - hiddenAt >= BACKGROUND_AUTO_APPLY_MS

      // Voltou depois de um tempo fora: aplica calado, sem banner.
      if (needRefreshRef.current && wasAwayLongEnough) {
        applyUpdate()
        return
      }

      checkForUpdate()
    }

    const intervalId = window.setInterval(checkForUpdate, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', checkForUpdate)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', checkForUpdate)
    }
  }, [applyUpdate])

  return {
    needRefresh: needRefresh && !isDismissed,
    isUpdating,
    applyUpdate,
    dismiss,
  }
}
