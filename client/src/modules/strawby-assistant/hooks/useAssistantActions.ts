import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useAssistantChat'
import { useSuggestSubstitution } from './useSuggestSubstitution'
import { useSuggestSnack } from './useSuggestSnack'
import type { AssistantMode } from '../components/AssistantQuickActions'
import type { SendAssistantMessageData } from '../types/chat'
import type { SuggestSubstitutionData } from '../types/substitution'
import type { SuggestSnackData } from '../types/snackSuggestion'

export const useAssistantActions = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<AssistantMode>('meal')
  const { messages, sendMessage, isPending: isChatPending } = useAssistantChat()
  const substitutionMutation = useSuggestSubstitution()
  const snackMutation = useSuggestSnack()

  const isPending = isChatPending || substitutionMutation.isPending || snackMutation.isPending

  const appendMessage = useCallback(
    (message: { id: string; role: 'user' | 'assistant'; content: string; createdAt: string }) => {
      queryClient.setQueryData<typeof message[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [...old, message])
    },
    [queryClient],
  )

  const submitMeal = useCallback(
    async (data: SendAssistantMessageData) => {
      await sendMessage(data)
    },
    [sendMessage],
  )

  const submitSubstitution = useCallback(
    async (data: SuggestSubstitutionData) => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: `Substituir "${data.foodName}" por ${data.goal}`,
        createdAt: new Date().toISOString(),
      })

      const result = await substitutionMutation.mutateAsync(data)

      const validCount = result.substitutions.filter((s) => s.food).length
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          validCount > 0
            ? `Encontrei ${validCount} alternativa(s) para "${data.foodName}".`
            : `Não encontrei alternativas para "${data.foodName}" no banco de alimentos.`,
        createdAt: new Date().toISOString(),
      })

      return result
    },
    [appendMessage, substitutionMutation],
  )

  const submitSnack = useCallback(
    async (data: SuggestSnackData = {}) => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: `Sugerir ${data.mealType ? `opções de ${data.mealType}` : 'lanches'}`,
        createdAt: new Date().toISOString(),
      })

      const result = await snackMutation.mutateAsync(data)

      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          result.options.length > 0
            ? `Aqui estão ${result.options.length} opção(ões) de lanche.`
            : 'Não consegui sugerir lanches no momento.',
        createdAt: new Date().toISOString(),
      })

      return result
    },
    [appendMessage, snackMutation],
  )

  return {
    mode,
    setMode,
    messages,
    isPending,
    submitMeal,
    submitSubstitution,
    submitSnack,
    substitutionResult: substitutionMutation.data,
    snackResult: snackMutation.data,
    substitutionError: substitutionMutation.error,
    snackError: snackMutation.error,
  }
}
