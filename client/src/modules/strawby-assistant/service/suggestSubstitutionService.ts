import { api } from '@/api/axios'
import type { SuggestSubstitutionData, SuggestSubstitutionResponse } from '../types/substitution'

export const suggestSubstitutionService = async (
  dto: SuggestSubstitutionData,
): Promise<SuggestSubstitutionResponse> => {
  const { data } = await api.post<SuggestSubstitutionResponse>('/strawby-assistant/suggest-substitutions', dto)
  return data
}
