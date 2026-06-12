import { Navigate } from 'react-router-dom'

interface StandaloneRedirectProps {
  children: React.ReactNode
}

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true

export default function StandaloneRedirect({ children }: StandaloneRedirectProps) {
  if (isStandalone) {
    return <Navigate to="/app/home" replace />
  }

  return <>{children}</>
}
