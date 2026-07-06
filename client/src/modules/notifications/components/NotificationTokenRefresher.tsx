import { useEffect } from 'react'
import { useRefreshNotificationToken } from '../hooks/useRefreshNotificationToken'
import { logBootstrap } from '@/shared/components/BootstrapDiagnostics'

export default function NotificationTokenRefresher() {
  useEffect(() => {
    logBootstrap('NotificationTokenRefresher montado')
  }, [])

  useRefreshNotificationToken()
  return null
}
