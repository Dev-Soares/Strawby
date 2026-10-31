import { useCallback } from 'react'
import { useGetAssistantChat } from './useGetAssistantChat'
import { useSendAssistantMessage } from './useSendAssistantMessage'
import type { SendAssistantMessageData, SuggestedMeal } from '../types/chat'

export const useAssistantChat = () => {
  const { data: messages = [] } = useGetAssistantChat()
  const mutation = useSendAssistantMessage()

  const sendMessage = useCallback(
    async (data: SendAssistantMessageData) => {
      await mutation.mutateAsync(data)
    },
    [mutation],
  )

  const addSuggestedMeal = useCallback((meal: SuggestedMeal) => {
    void meal
  }, [])

  return {
    messages,
    sendMessage,
    isPending: mutation.isPending,
    addSuggestedMeal,
  }
}
