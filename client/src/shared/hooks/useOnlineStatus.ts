import { useEffect, useState } from 'react'
import { NETWORK_ERROR_EVENT, NETWORK_OK_EVENT } from '@/api/axios'

/**
 * Status de conectividade do app.
 *
 * `navigator.onLine` é otimista: reporta `true` quando há interface de rede,
 * mesmo sem saída real (wi-fi de portal cativo, 4G sem dados). Por isso o
 * estado também reage aos eventos do interceptor do axios — uma request que
 * falhou sem resposta é o único sinal confiável de que não há rede.
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    window.addEventListener(NETWORK_OK_EVENT, goOnline)
    window.addEventListener(NETWORK_ERROR_EVENT, goOffline)

    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
      window.removeEventListener(NETWORK_OK_EVENT, goOnline)
      window.removeEventListener(NETWORK_ERROR_EVENT, goOffline)
    }
  }, [])

  return isOnline
}
