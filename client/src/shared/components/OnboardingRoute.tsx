import { Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import RouteSkeleton from './RouteSkeleton'

interface OnboardingRouteProps {
  children: React.ReactNode
}

export default function OnboardingRoute({ children }: OnboardingRouteProps) {
  const { data: user, isPending } = useAuth()

  if (isPending) {
    return <RouteSkeleton />
  }

  if (!user) {
    return <Navigate to="/app/login" replace />
  }

  if (user.patient || user.nutritionist) {
    return <Navigate to="/app/home" replace />
  }

  return <>{children}</>
}
