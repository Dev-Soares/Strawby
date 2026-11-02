import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useAssistantChat'
import { useSuggestSnack } from './useSuggestSnack'
import { useAddSuggestedMeal } from './useAddSuggestedMeal'
import type { SendAssistantMessageData } from '../types/chat'
import { mealTypeLabels, type AddSuggestedMealData, type SuggestSnackData, type SuggestSnackResponse } from '../types/snackSuggestion'

export type AssistantStep = 'choose' | 'meal' | 'snack'

const STEP_STORAGE_KEY = 'strawby-assistant-step'
const SNACK_RESULT_STORAGE_KEY = 'strawby-assistant-snack-result'

const readStoredStep = (): AssistantStep => {
  if (typeof window === 'undefined') return 'choose'
  const stored = window.sessionStorage.getItem(STEP_STORAGE_KEY)
  if (stored === 'meal' || stored === 'snack' || stored === 'choose') return stored
  return 'choose'
}

const readStoredSnackResult = (): SuggestSnackResponse | undefined => {
  if (typeof window === 'undefined') return undefined
  const stored = window.sessionStorage.getItem(SNACK_RESULT_STORAGE_KEY)
  if (!stored) return undefined
  try {
    return JSON.parse(stored) as SuggestSnackResponse
  } catch {
    return undefined
  }
}

export const useAssistantActions = () => {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<AssistantStep>(readStoredStep)
  const [storedSnackResult, setStoredSnackResult] = useState<SuggestSnackResponse | undefined>(readStoredSnackResult)
  const { messages, sendMessage, isPending: isChatPending, clearMessages } = useAssistantChat()
  const snackMutation = useSuggestSnack()
  const addSuggestedMealMutation = useAddSuggestedMeal()

  const isPending = isChatPending || snackMutation.isPending || addSuggestedMealMutation.isPending

  const updateStep = useCallback((next: AssistantStep) => {
    window.sessionStorage.setItem(STEP_STORAGE_KEY, next)
    setStep(next)
  }, [])

  const appendMessage = useCallback(
    (message: { id: string; role: 'user' | 'assistant'; content: string; createdAt: string }) => {
      queryClient.setQueryData<typeof message[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [...old, message])
    },
    [queryClient],
  )

  const selectMeal = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: 'Quero que você registre uma refeição pra mim',
      createdAt: new Date().toISOString(),
    })
    updateStep('meal')
  }, [appendMessage, updateStep])

  const selectSnack = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: 'Quero que você me sugira uma refeição',
      createdAt: new Date().toISOString(),
    })
    updateStep('snack')
  }, [appendMessage, updateStep])

  const submitMeal = useCallback(
    async (data: SendAssistantMessageData) => {
      await sendMessage(data)
    },
    [sendMessage],
  )

  const submitSnack = useCallback(
    async (data: SuggestSnackData = {}) => {
      const result = await snackMutation.mutateAsync(data)

      window.sessionStorage.setItem(SNACK_RESULT_STORAGE_KEY, JSON.stringify(result))
      setStoredSnackResult(result)

      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          result.options.length > 0
            ? `Aqui estão ${result.options.length} opções de ${data.mealType ? mealTypeLabels[data.mealType]?.toLowerCase() ?? 'refeição' : 'refeição'}.`
            : 'Não consegui sugerir refeições no momento.',
        createdAt: new Date().toISOString(),
      })

      return result
    },
    [appendMessage, snackMutation],
  )

  const addSuggestedMeal = useCallback(
    async (data: AddSuggestedMealData) => {
      await addSuggestedMealMutation.mutateAsync(data)

      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Adicionei "${data.mealName}" ao seu diário de hoje.`,
        createdAt: new Date().toISOString(),
      })
    },
    [addSuggestedMealMutation, appendMessage],
  )

  const startNewConversation = useCallback(() => {
    clearMessages()
    updateStep('choose')
    snackMutation.reset()
    addSuggestedMealMutation.reset()
    window.sessionStorage.removeItem(SNACK_RESULT_STORAGE_KEY)
    setStoredSnackResult(undefined)
  }, [clearMessages, updateStep, snackMutation, addSuggestedMealMutation])

  return {
    step,
    selectMeal,
    selectSnack,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    addSuggestedMeal,
    startNewConversation,
    snackResult: snackMutation.data ?? storedSnackResult,
    snackError: snackMutation.error,
    addSuggestedMealError: addSuggestedMealMutation.error,
  }
}
