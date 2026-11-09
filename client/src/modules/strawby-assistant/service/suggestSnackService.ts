import { api } from '@/api/axios'
import type { SuggestSnackData, SuggestSnackResponse } from '../types/snackSuggestion'

export const suggestSnackService = async (
  dto: SuggestSnackData,
): Promise<SuggestSnackResponse> => {
  const { data } = await api.post<SuggestSnackResponse>('/strawby-assistant/suggest-snack', dto)
  return data
}
