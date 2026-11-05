import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { isServiceUnavailableError } from '@/shared/utils/isServiceUnavailableError'
import { sendAssistantMessageService } from '../service/sendAssistantMessageService'
import { ASSISTANT_UNAVAILABLE_MESSAGE } from '../config/assistantCopy'
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
    onSuccess: (reply) => {
      queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [
        ...old,
        reply,
      ])
    },
    onError: (error, _dto, context) => {
      // IA fora do ar: o mascote avisa dentro da conversa e a fala do usuário
      // continua na thread — toast de erro aqui soaria como bug do app.
      if (isServiceUnavailableError(error)) {
        queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [
          ...old,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: ASSISTANT_UNAVAILABLE_MESSAGE,
            createdAt: new Date().toISOString(),
            status: 'unavailable',
          },
        ])
        return
      }

      if (context) {
        queryClient.setQueryData(ASSISTANT_CHAT_QUERY_KEY, context.previousMessages)
      }
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}
