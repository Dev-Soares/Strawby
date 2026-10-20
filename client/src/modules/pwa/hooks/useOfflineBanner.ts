import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'

const RECONNECTED_DISPLAY_MS = 2500

type BannerState = 'hidden' | 'offline' | 'reconnected'

/**
 * Orquestra o banner de conectividade.
 *
 * Offline → banner persistente. Ao voltar, mostra confirmação por alguns
 * segundos e revalida as queries ativas (que falharam enquanto estava offline
 * e, sem isso, ficariam em `isError` até o próximo mount).
 */
export const useOfflineBanner = () => {
  const isOnline = useOnlineStatus()
  const queryClient = useQueryClient()
  const [state, setState] = useState<BannerState>('hidden')
  const wasOfflineRef = useRef(false)

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true
      setState('offline')
      return
    }

    // Online desde o início — nunca mostra o banner de "voltou".
    if (!wasOfflineRef.current) {
      setState('hidden')
      return
    }

    wasOfflineRef.current = false
    setState('reconnected')
    void queryClient.refetchQueries({ type: 'active' })

    const timeoutId = setTimeout(() => setState('hidden'), RECONNECTED_DISPLAY_MS)
    return () => clearTimeout(timeoutId)
  }, [isOnline, queryClient])

  const retry = () => {
    void queryClient.refetchQueries({ type: 'active' })
  }

  return { state, retry }
}
