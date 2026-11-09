import { useCallback, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import TourOverlay from '../components/TourOverlay'
import {
  NOTIF_AFTER_TUTORIAL_KEY,
  TUTORIAL_ACTIVE_KEY,
  TUTORIAL_COMPLETE_EVENT,
} from '../config/tourStorage'
import type { TourFinishReason } from '../hooks/useTourFlow'
import { TourContext } from './tour-context'

/** Dono do estado do tutorial e de quem monta o overlay. */
export default function TourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const [isActive, setIsActive] = useState(false)

  // perfil 'user' é a conta que ainda não escolheu papel: não tem tutorial
  const role =
    user?.role === 'nutritionist' ? 'nutritionist' : user?.role === 'patient' ? 'patient' : null

  const start = useCallback(() => {
    if (!role) return
    sessionStorage.setItem(TUTORIAL_ACTIVE_KEY, '1')
    setIsActive(true)
  }, [role])

  const finish = useCallback(
    (reason: TourFinishReason) => {
      setIsActive(false)
      sessionStorage.removeItem(TUTORIAL_ACTIVE_KEY)

      if (reason !== 'complete') return

      sessionStorage.setItem(NOTIF_AFTER_TUTORIAL_KEY, '1')
      navigate('/app/home')
      // o layout não remonta quando o tutorial acaba na própria rota de destino
      window.dispatchEvent(new Event(TUTORIAL_COMPLETE_EVENT))
    },
    [navigate],
  )

  return (
    <TourContext.Provider value={{ start, isActive }}>
      {children}
      {isActive && role && <TourOverlay role={role} onFinish={finish} />}
    </TourContext.Provider>
  )
}
