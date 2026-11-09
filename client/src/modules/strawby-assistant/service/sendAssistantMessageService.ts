import { api } from '@/api/axios'
import type { AssistantMessage, SendAssistantMessageData } from '../types/chat'

type SendAssistantMessageResponse = {
  reply: AssistantMessage
}

export const sendAssistantMessageService = async (dto: SendAssistantMessageData): Promise<AssistantMessage> => {
  const { data } = await api.post<SendAssistantMessageResponse>('/strawby-assistant/preview-meal', dto)
  return data.reply
}
