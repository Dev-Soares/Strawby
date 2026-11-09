import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  AssistantSessionContext,
  type AssistantStep,
} from './assistant-session-context'
import type { SuggestSnackResponse } from '../types/snackSuggestion'

interface AssistantSessionProviderProps {
  children: ReactNode
}

export default function AssistantSessionProvider({
  children,
}: AssistantSessionProviderProps) {
  const [step, setStep] = useState<AssistantStep>('choose')
  const [snackResult, setSnackResult] = useState<SuggestSnackResponse | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const resetSession = useCallback(() => {
    setStep('choose')
    setSnackResult(null)
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const value = useMemo(
    () => ({
      step,
      setStep,
      snackResult,
      setSnackResult,
      resetSession,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [step, snackResult, resetSession, isDrawerOpen, openDrawer, closeDrawer],
  )

  return (
    <AssistantSessionContext.Provider value={value}>
      {children}
    </AssistantSessionContext.Provider>
  )
}
