import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetAssistantChat, ASSISTANT_CHAT_QUERY_KEY } from './useGetAssistantChat'
import { useSendAssistantMessage } from './useSendAssistantMessage'
import type { AssistantMessage, SendAssistantMessageData } from '../types/chat'

export { ASSISTANT_CHAT_QUERY_KEY }

export const useAssistantChat = () => {
  const queryClient = useQueryClient()
  const { data: messages = [] } = useGetAssistantChat()
  const mutation = useSendAssistantMessage()

  const sendMessage = useCallback(
    async (data: SendAssistantMessageData) => {
      // o `onError` da mutation já resolve o feedback (fala do mascote ou toast);
      // propagar aqui só geraria unhandled rejection no submit do ChatInput
      try {
        await mutation.mutateAsync(data)
      } catch {
        // tratado no onError
      }
    },
    [mutation],
  )

  const clearMessages = useCallback(() => {
    queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, [])
  }, [queryClient])

  return {
    messages,
    sendMessage,
    isPending: mutation.isPending,
    clearMessages,
  }
}
