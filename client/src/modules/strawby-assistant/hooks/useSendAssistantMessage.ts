import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { isServiceUnavailableError } from '@/shared/utils/isServiceUnavailableError'
import { getApiErrorCode } from '@/shared/utils/getApiErrorCode'
import { sendAssistantMessageService } from '../service/sendAssistantMessageService'
import {
  ASSISTANT_QUOTA_EXCEEDED_MESSAGE,
  ASSISTANT_UNAVAILABLE_MESSAGE,
} from '../config/assistantCopy'
import { ASSISTANT_QUOTA_EXCEEDED_CODE } from '../config/assistantErrors'
import { ASSISTANT_CHAT_QUERY_KEY } from './useGetAssistantChat'
import type {
  AssistantMessage,
  AssistantMessageStatus,
  SendAssistantMessageData,
} from '../types/chat'

type MascotFallback = { content: string; status: AssistantMessageStatus }

/**
 * Falhas que o mascote assume como fala própria em vez de virarem toast: não
 * são bug do app, são situações que ele sabe explicar. Qualquer outro erro cai
 * no toast genérico.
 */
const resolveMascotFallback = (error: unknown): MascotFallback | null => {
  // cota diária esgotada — o 429 vem marcado porque o throttle por IP usa o
  // mesmo status e mereceria outra fala
  if (getApiErrorCode(error) === ASSISTANT_QUOTA_EXCEEDED_CODE) {
    return { content: ASSISTANT_QUOTA_EXCEEDED_MESSAGE, status: 'quota_exceeded' }
  }

  if (isServiceUnavailableError(error)) {
    return { content: ASSISTANT_UNAVAILABLE_MESSAGE, status: 'unavailable' }
  }

  return null
}

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
      // o mascote responde dentro da conversa e a fala do usuário continua na
      // thread — toast de erro aqui soaria como bug do app
      const fallback = resolveMascotFallback(error)

      if (fallback) {
        queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [
          ...old,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: fallback.content,
            createdAt: new Date().toISOString(),
            status: fallback.status,
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
