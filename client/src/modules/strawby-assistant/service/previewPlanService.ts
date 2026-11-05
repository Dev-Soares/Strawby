import { api } from '@/api/axios'
import type { AssistantMessage } from '../types/chat'
import type { PreviewPlanData } from '../types/planGeneration'

type PreviewPlanResponse = {
  reply: AssistantMessage
}

export const previewPlanService = async (body: PreviewPlanData): Promise<AssistantMessage> => {
  const { data } = await api.post<PreviewPlanResponse>('/strawby-assistant/preview-plan', body)
  return data.reply
}
