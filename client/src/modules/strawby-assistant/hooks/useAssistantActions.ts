import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useAssistantChat'
import { useAssistantSession } from './useAssistantSession'
import { useSuggestSnack } from './useSuggestSnack'
import { useAddSuggestedMeal } from './useAddSuggestedMeal'
import { useConfirmMeal } from './useConfirmMeal'
import type { AssistantMessageStatus, MealDraft, SendAssistantMessageData } from '../types/chat'
import type { AddSuggestedMealData, SuggestSnackData } from '../types/snackSuggestion'
import {
  buildMealAddedMessage,
  buildMealTypeChoiceMessage,
  buildSuggestionIntro,
  SUGGESTION_EMPTY_MESSAGE,
} from '../config/assistantCopy'
import { thinkingDelay } from '../config/assistantTiming'

export type { AssistantStep } from '../contexts/assistant-session-context'

export const useAssistantActions = () => {
  const queryClient = useQueryClient()
  const { step, setStep, snackResult, setSnackResult, resetSession } = useAssistantSession()
  const { messages, sendMessage, isPending: isChatPending, clearMessages } = useAssistantChat()
  const snackMutation = useSuggestSnack()
  const addSuggestedMealMutation = useAddSuggestedMeal()
  const confirmMealMutation = useConfirmMeal()
  const [isThinking, setIsThinking] = useState(false)

  const isPending =
    isChatPending ||
    isThinking ||
    snackMutation.isPending ||
    addSuggestedMealMutation.isPending ||
    confirmMealMutation.isPending

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
    setStep('meal')
  }, [appendMessage, setStep])

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
      content: 'Qual refeição você quer que eu sugira?',
      createdAt: new Date().toISOString(),
      status: 'prompt',
    })
    setStep('snack')
  }, [appendMessage, setStep])

  const submitMeal = useCallback(
    async (data: SendAssistantMessageData) => {
      await sendMessage(data)
    },
    [sendMessage],
  )

  const submitSnack = useCallback(
    async (data: SuggestSnackData = {}) => {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: buildMealTypeChoiceMessage(data.mealType),
        createdAt: new Date().toISOString(),
      })

      // o catálogo responde na hora: segura o resultado até o tempo de "pensando" fechar
      setIsThinking(true)
      const [result] = await Promise.all([
        snackMutation.mutateAsync(data),
        thinkingDelay(),
      ]).finally(() => setIsThinking(false))

      setSnackResult(result)

      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          result.options.length > 0
            ? buildSuggestionIntro(result.options.length, data.mealType)
            : SUGGESTION_EMPTY_MESSAGE,
        createdAt: new Date().toISOString(),
      })

      return result
    },
    [appendMessage, setSnackResult, snackMutation],
  )

  const addSuggestedMeal = useCallback(
    async (data: AddSuggestedMealData) => {
      await addSuggestedMealMutation.mutateAsync(data)

      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: buildMealAddedMessage(data.mealName),
        createdAt: new Date().toISOString(),
        status: 'created',
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
    resetSession()
    snackMutation.reset()
    addSuggestedMealMutation.reset()
    confirmMealMutation.reset()
  }, [
    clearMessages,
    resetSession,
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
    snackResult,
    snackError: snackMutation.error,
    addSuggestedMealError: addSuggestedMealMutation.error,
  }
}
