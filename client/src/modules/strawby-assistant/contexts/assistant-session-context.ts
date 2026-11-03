import { createContext } from 'react'
import type { SuggestSnackResponse } from '../types/snackSuggestion'

export type AssistantStep = 'choose' | 'meal' | 'snack'

export type AssistantSessionValue = {
  step: AssistantStep
  setStep: (step: AssistantStep) => void
  snackResult: SuggestSnackResponse | null
  setSnackResult: (result: SuggestSnackResponse | null) => void
  resetSession: () => void
}

/**
 * Estado da conversa que precisa sobreviver ao fechamento do drawer: o drawer
 * desmonta ao fechar, mas as mensagens ficam no cache do TanStack Query — sem
 * este contexto, só metade da conversa voltava ao reabrir (mensagens sim, etapa
 * e sugestões não).
 */
export const AssistantSessionContext =
  createContext<AssistantSessionValue | null>(null)
