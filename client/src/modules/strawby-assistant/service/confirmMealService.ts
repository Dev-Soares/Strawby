import { api } from '@/api/axios'
import type { AssistantMessage, ConfirmMealData } from '../types/chat'

type ConfirmMealResponse = {
  reply: AssistantMessage
}

export const confirmMealService = async (body: ConfirmMealData): Promise<AssistantMessage> => {
  const { data } = await api.post<ConfirmMealResponse>('/strawby-assistant/confirm-meal', body)
  return data.reply
}
