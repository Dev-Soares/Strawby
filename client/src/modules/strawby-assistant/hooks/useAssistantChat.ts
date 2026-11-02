import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useGetAssistantChat'
import { useSendAssistantMessage } from './useSendAssistantMessage'
import type { AssistantMessage, SendAssistantMessageData, SuggestedMeal } from '../types/chat'

export const useAssistantChat = () => {
  const queryClient = useQueryClient()
  const { data: messages = [] } = useGetAssistantChat()
  const mutation = useSendAssistantMessage()
  const [isSimulatingPending, setIsSimulatingPending] = useState(false)

  const sendMessage = useCallback(
    async (data: SendAssistantMessageData) => {
      await mutation.mutateAsync(data)
    },
    [mutation],
  )

  const addSuggestedMeal = useCallback((meal: SuggestedMeal) => {
    void meal
  }, [])

  const appendMessage = useCallback(
    (message: AssistantMessage) => {
      queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [
        ...old,
        message,
      ])
    },
    [queryClient],
  )

  const clearMessages = useCallback(() => {
    queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, [])
  }, [queryClient])

  const simulateTyping = useCallback(() => setIsSimulatingPending(true), [])
  const stopTyping = useCallback(() => setIsSimulatingPending(false), [])

  return {
    messages,
    sendMessage,
    isPending: mutation.isPending || isSimulatingPending,
    addSuggestedMeal,
    appendMessage,
    clearMessages,
    simulateTyping,
    stopTyping,
  }
}
