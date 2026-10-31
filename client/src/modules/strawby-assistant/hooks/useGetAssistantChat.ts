import { useQuery } from '@tanstack/react-query'
import { getAssistantChatService } from '../service/getAssistantChatService'

export const ASSISTANT_CHAT_QUERY_KEY = ['assistant-chat'] as const

export const useGetAssistantChat = () => {
  return useQuery({
    queryKey: ASSISTANT_CHAT_QUERY_KEY,
    queryFn: getAssistantChatService,
  })
}
