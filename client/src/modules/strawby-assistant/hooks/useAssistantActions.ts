import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ACTIVITY_LEVELS } from '@/shared/config/activityLevels'
import { useAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useAssistantChat'
import { useAssistantSession } from './useAssistantSession'
import { useSuggestSnack } from './useSuggestSnack'
import { useAddSuggestedMeal } from './useAddSuggestedMeal'
import { useConfirmMeal } from './useConfirmMeal'
import { usePreviewPlan } from './usePreviewPlan'
import { useConfirmPlan } from './useConfirmPlan'
import type { AssistantMessage, MealDraft, SendAssistantMessageData } from '../types/chat'
import type { AddSuggestedMealData, SuggestSnackData } from '../types/snackSuggestion'
import type { PlanDraft, PreviewPlanData } from '../types/planGeneration'
import {
  buildActivityLevelChoiceMessage,
  buildMealAddedMessage,
  buildMealTypeChoiceMessage,
  buildSuggestionIntro,
  PLAN_DISCARDED_MESSAGE,
  PLAN_INTENT_MESSAGE,
  PLAN_PROMPT_MESSAGE,
  SUGGESTION_EMPTY_MESSAGE,
} from '../config/assistantCopy'
import { actionDelay, thinkingDelay } from '../config/assistantTiming'

export type { AssistantStep } from '../contexts/assistant-session-context'

export const useAssistantActions = () => {
  const queryClient = useQueryClient()
  const { step, setStep, snackResult, setSnackResult, resetSession } = useAssistantSession()
  const { messages, sendMessage, isPending: isChatPending, clearMessages } = useAssistantChat()
  const snackMutation = useSuggestSnack()
  const addSuggestedMealMutation = useAddSuggestedMeal()
  const confirmMealMutation = useConfirmMeal()
  const previewPlanMutation = usePreviewPlan()
  const confirmPlanMutation = useConfirmPlan()
  const [isThinking, setIsThinking] = useState(false)

  // trava síncrona contra duplo envio: o `isPending` só desabilita o botão no
  // re-render seguinte, então dois cliques no mesmo tick passavam os dois
  const submitLockRef = useRef(false)

  const isPending =
    isChatPending ||
    isThinking ||
    snackMutation.isPending ||
    addSuggestedMealMutation.isPending ||
    confirmMealMutation.isPending ||
    previewPlanMutation.isPending ||
    confirmPlanMutation.isPending

  const appendMessage = useCallback(
    (message: AssistantMessage) => {
      queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [...old, message])
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

  const selectPlan = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'user',
      content: PLAN_INTENT_MESSAGE,
      createdAt: new Date().toISOString(),
    })
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: PLAN_PROMPT_MESSAGE,
      createdAt: new Date().toISOString(),
      status: 'prompt',
    })
    setStep('plan')
  }, [appendMessage, setStep])

  const submitMeal = useCallback(
    async (data: SendAssistantMessageData) => {
      await sendMessage(data)
    },
    [sendMessage],
  )

  const submitSnack = useCallback(
    async (data: SuggestSnackData = {}) => {
      if (submitLockRef.current) return
      submitLockRef.current = true

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
      ]).finally(() => {
        setIsThinking(false)
        submitLockRef.current = false
      })

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
      if (submitLockRef.current) return
      submitLockRef.current = true

      try {
        await addSuggestedMealMutation.mutateAsync(data)

        appendMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: buildMealAddedMessage(data.mealName),
          createdAt: new Date().toISOString(),
          status: 'created',
        })
      } finally {
        submitLockRef.current = false
      }
    },
    [addSuggestedMealMutation, appendMessage],
  )

  /** Grava a refeição que o Strawby montou e o usuário aprovou. */
  const confirmDraft = useCallback(
    async (draft: MealDraft) => {
      if (submitLockRef.current) return
      submitLockRef.current = true

      try {
        await confirmMealMutation.mutateAsync({
          mealType: draft.mealType ?? undefined,
          time: draft.time ?? undefined,
          observations: draft.observations ?? undefined,
          items: draft.items.map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
        })
      } catch {
        // tratado no onError da mutation
      } finally {
        submitLockRef.current = false
      }
    },
    [confirmMealMutation],
  )

  /** Calcula o plano recomendado — a resposta chega com o rascunho pra confirmar. */
  const submitPlan = useCallback(
    async (data: PreviewPlanData) => {
      if (submitLockRef.current) return
      submitLockRef.current = true

      const label =
        ACTIVITY_LEVELS.find((level) => level.value === data.movementLevel)?.label ??
        'moderado'

      appendMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: buildActivityLevelChoiceMessage(label),
        createdAt: new Date().toISOString(),
      })

      // o cálculo responde na hora: segura a resposta até o tempo de "pensando" fechar
      setIsThinking(true)
      try {
        const [reply] = await Promise.all([
          previewPlanMutation.mutateAsync({ movementLevel: data.movementLevel }),
          thinkingDelay(),
        ])
        appendMessage(reply)
      } catch {
        // tratado no onError da mutation
      } finally {
        setIsThinking(false)
        submitLockRef.current = false
      }
    },
    [appendMessage, previewPlanMutation],
  )

  /** Grava o plano que o Strawby calculou e o usuário aprovou. */
  const confirmPlanDraft = useCallback(
    async (draft: PlanDraft) => {
      if (submitLockRef.current) return
      submitLockRef.current = true

      setIsThinking(true)
      try {
        // só as macros: o `replacesExisting` do rascunho é rejeitado pelo
        // whitelist do backend
        const [reply] = await Promise.all([
          confirmPlanMutation.mutateAsync({
            calories: draft.calories,
            protein: draft.protein,
            carbs: draft.carbs,
            fat: draft.fat,
          }),
          actionDelay(),
        ])
        appendMessage(reply)
      } catch {
        // tratado no onError da mutation
      } finally {
        setIsThinking(false)
        submitLockRef.current = false
      }
    },
    [appendMessage, confirmPlanMutation],
  )

  /** Joga o plano calculado fora — a fala nova esconde o card e libera o seletor. */
  const discardPlanDraft = useCallback(() => {
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: PLAN_DISCARDED_MESSAGE,
      createdAt: new Date().toISOString(),
      status: 'prompt',
    })
  }, [appendMessage])

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
    previewPlanMutation.reset()
    confirmPlanMutation.reset()
  }, [
    clearMessages,
    resetSession,
    snackMutation,
    addSuggestedMealMutation,
    confirmMealMutation,
    previewPlanMutation,
    confirmPlanMutation,
  ])

  return {
    step,
    selectMeal,
    selectSnack,
    selectPlan,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    submitPlan,
    addSuggestedMeal,
    confirmDraft,
    discardDraft,
    confirmPlanDraft,
    discardPlanDraft,
    isConfirmingDraft: confirmMealMutation.isPending,
    // o `isThinking` entra aqui pro botão seguir travado durante a pausa que
    // vem depois do salvamento — sem isso ele volta ao normal antes do card sair
    isConfirmingPlan: confirmPlanMutation.isPending || isThinking,
    startNewConversation,
    snackResult,
    snackError: snackMutation.error,
    addSuggestedMealError: addSuggestedMealMutation.error,
  }
}
