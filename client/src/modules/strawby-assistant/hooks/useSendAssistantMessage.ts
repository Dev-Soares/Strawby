import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { sendAssistantMessageService } from '../service/sendAssistantMessageService'
import { ASSISTANT_CHAT_QUERY_KEY } from './useGetAssistantChat'
import type { AssistantMessage, SendAssistantMessageData } from '../types/chat'

export const useSendAssistantMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SendAssistantMessageData) => sendAssistantMessageService(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: ASSISTANT_CHAT_QUERY_KEY })

      const previousMessages = queryClient.getQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY) ?? []

      const optimisticMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: dto.message,
        createdAt: new Date().toISOString(),
      }

      queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, [
        ...previousMessages,
        optimisticMessage,
      ])

      return { previousMessages }
    },
    onError: (_error, _dto, context) => {
      if (context) {
        queryClient.setQueryData(ASSISTANT_CHAT_QUERY_KEY, context.previousMessages)
      }
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_CHAT_QUERY_KEY })
    },
  })
}
