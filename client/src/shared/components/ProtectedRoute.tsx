import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import LoginSkeleton from '@/modules/auth/skeletons/LoginSkeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isPending } = useAuth()
  const location = useLocation()

  if (isPending) {
    return <LoginSkeleton />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
