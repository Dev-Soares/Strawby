import { useEffect, useRef } from 'react'
import { TUTORIAL_ACTIVE_KEY, TUTORIAL_PENDING_KEY } from '../config/tourStorage'
import { useTour } from './useTour'

/** Espera a primeira tela pintar antes de medir os alvos. */
const START_DELAY_MS = 1000

/**
 * Dispara o tutorial logo depois do onboarding, quando `useCompleteOnboarding`
 * deixa a chave pendente na sessão.
 */
export function useAutoTutorial() {
  const start = useTour().start
  const startRef = useRef(start)

  useEffect(() => {
    startRef.current = start
  }, [start])

  useEffect(() => {
    if (!sessionStorage.getItem(TUTORIAL_PENDING_KEY)) return

    sessionStorage.removeItem(TUTORIAL_PENDING_KEY)
    sessionStorage.setItem(TUTORIAL_ACTIVE_KEY, '1')
    let fired = false

    const timer = setTimeout(() => {
      fired = true
      startRef.current()
    }, START_DELAY_MS)

    return () => {
      clearTimeout(timer)
      // desmontou antes de abrir (StrictMode, troca de rota): devolve a pendência
      if (!fired) {
        sessionStorage.setItem(TUTORIAL_PENDING_KEY, '1')
        sessionStorage.removeItem(TUTORIAL_ACTIVE_KEY)
      }
    }
  }, [])
}
