import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { data: user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse h-8 w-32 rounded-full bg-neutral-200" />
      </div>
    )
  }

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    return <Navigate to={from ?? '/home'} replace />
  }

  return <>{children}</>
}
