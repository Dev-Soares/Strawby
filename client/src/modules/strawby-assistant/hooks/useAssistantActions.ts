import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useAssistantChat'
import { useSuggestSnack } from './useSuggestSnack'
import { useAddSuggestedMeal } from './useAddSuggestedMeal'
import { useConfirmMeal } from './useConfirmMeal'
import type { AssistantMessageStatus, MealDraft, SendAssistantMessageData } from '../types/chat'
import { mealTypeLabels, type AddSuggestedMealData, type SuggestSnackData } from '../types/snackSuggestion'

export type AssistantStep = 'choose' | 'meal' | 'snack'

export const useAssistantActions = () => {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<AssistantStep>('choose')
  const { messages, sendMessage, isPending: isChatPending, clearMessages } = useAssistantChat()
  const snackMutation = useSuggestSnack()
  const addSuggestedMealMutation = useAddSuggestedMeal()
  const confirmMealMutation = useConfirmMeal()

  const isPending =
    isChatPending ||
    snackMutation.isPending ||
    addSuggestedMealMutation.isPending ||
    confirmMealMutation.isPending

  const updateStep = useCallback((next: AssistantStep) => setStep(next), [])

  const appendMessage = useCallback(
    (message: {
      id: string
      role: 'user' | 'assistant'
      content: string
      createdAt: string
      status?: AssistantMessageStatus
    }) => {
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
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Me conta o que você comeu que eu registro pra você.',
      createdAt: new Date().toISOString(),
      status: 'prompt',
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
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Qual tipo de refeição você quer sugerir?',
      createdAt: new Date().toISOString(),
      status: 'prompt',
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

  /** Grava a refeição que o Strawby montou e o usuário aprovou. */
  const confirmDraft = useCallback(
    async (draft: MealDraft) => {
      await confirmMealMutation.mutateAsync({
        mealType: draft.mealType ?? undefined,
        time: draft.time ?? undefined,
        observations: draft.observations ?? undefined,
        items: draft.items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      })
    },
    [confirmMealMutation],
  )

  /** Joga o rascunho fora — a fala nova esconde o card e libera o input. */
  const discardDraft = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Tudo bem, não registrei nada. Me conta de novo o que você comeu.',
      createdAt: new Date().toISOString(),
      status: 'prompt',
    })
  }, [appendMessage])

  const startNewConversation = useCallback(() => {
    clearMessages()
    updateStep('choose')
    snackMutation.reset()
    addSuggestedMealMutation.reset()
    confirmMealMutation.reset()
  }, [
    clearMessages,
    updateStep,
    snackMutation,
    addSuggestedMealMutation,
    confirmMealMutation,
  ])

  return {
    step,
    selectMeal,
    selectSnack,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    addSuggestedMeal,
    confirmDraft,
    discardDraft,
    isConfirmingDraft: confirmMealMutation.isPending,
    startNewConversation,
    snackResult: snackMutation.data,
    snackError: snackMutation.error,
    addSuggestedMealError: addSuggestedMealMutation.error,
  }
}
