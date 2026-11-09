import { api } from '@/api/axios'
import type { Meal } from '@/modules/meal/types/meal'
import type { AddSuggestedMealData } from '../types/snackSuggestion'

export const addSuggestedMealService = async (dto: AddSuggestedMealData): Promise<Meal> => {
  const { data } = await api.post<Meal>('/strawby-assistant/add-suggested-meal', dto)
  return data
}
