import { api } from '@/api/axios'
import type { AssistantMessage } from '../types/chat'
import type { ConfirmPlanData } from '../types/planGeneration'

type ConfirmPlanResponse = {
  reply: AssistantMessage
}

export const confirmPlanService = async (body: ConfirmPlanData): Promise<AssistantMessage> => {
  const { data } = await api.post<ConfirmPlanResponse>('/strawby-assistant/confirm-plan', body)
  return data.reply
}
