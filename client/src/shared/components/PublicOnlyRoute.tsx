import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import RouteSkeleton from './RouteSkeleton'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { data: user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <RouteSkeleton />
  }

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    return <Navigate to={from ?? '/home'} replace />
  }

  return <>{children}</>
}
