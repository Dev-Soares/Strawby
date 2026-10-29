import { useEffect } from 'react'

const RECOVERY_KEY = 'pwa:chunk-recovery'

// Deploy novo remove os chunks hasheados antigos. Se o app tentar importar um
// chunk que não existe mais, o Vite dispara `vite:preloadError` e a rota quebra.
// Aqui a gente força o SW novo e recarrega — uma vez por sessão, sem loop.
export const usePwaPreloadErrorRecovery = () => {
  useEffect(() => {
    const recover = async () => {
      if (!('serviceWorker' in navigator)) {
        window.location.reload()
        return
      }

      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          registrations.map(async (registration) => {
            await registration.update().catch(() => {})
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
          }),
        )
      } catch {
        // segue pro reload mesmo assim
      }

      window.location.reload()
    }

    const handlePreloadError = (event: Event) => {
      // Evita que o erro suba e derrube a árvore no GlobalErrorBoundary.
      event.preventDefault()

      try {
        if (sessionStorage.getItem(RECOVERY_KEY)) return
        sessionStorage.setItem(RECOVERY_KEY, '1')
      } catch {
        return
      }

      void recover()
    }

    window.addEventListener('vite:preloadError', handlePreloadError)

    return () => window.removeEventListener('vite:preloadError', handlePreloadError)
  }, [])
}
