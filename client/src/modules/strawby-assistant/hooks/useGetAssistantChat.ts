import { useQuery } from '@tanstack/react-query'
import { getAssistantChatService } from '../service/getAssistantChatService'

export const ASSISTANT_CHAT_QUERY_KEY = ['assistant-chat'] as const

/**
 * A conversa não existe no backend: ela é montada no cliente e fica parada
 * nesta entrada do cache. Por isso a query nunca pode revalidar — qualquer
 * refetch roda o `queryFn`, que devolve `[]`, e apaga o histórico inteiro
 * (era o que zerava o chat ao trocar de janela ou remontar o drawer).
 */
export const useGetAssistantChat = () => {
  return useQuery({
    queryKey: ASSISTANT_CHAT_QUERY_KEY,
    queryFn: getAssistantChatService,
    initialData: [],
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
