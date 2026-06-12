import { useRefreshNotificationToken } from '../hooks/useRefreshNotificationToken'

export default function NotificationTokenRefresher() {
  useRefreshNotificationToken()
  return null
}
