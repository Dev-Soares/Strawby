import { Navigate } from 'react-router-dom'
import { useState } from 'react'

interface StandaloneRedirectProps {
  children: React.ReactNode
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export default function StandaloneRedirect({ children }: StandaloneRedirectProps) {
  const [isStandalone] = useState(() => checkIsStandalone())

  if (isStandalone) {
    return <Navigate to="/app/home" replace />
  }

  return <>{children}</>
}
