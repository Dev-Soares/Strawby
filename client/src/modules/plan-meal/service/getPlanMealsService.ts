import { api } from '@/api/axios'
import type { PlanMealSummary } from '../types/planMeal'

export const getPlanMealsService = async (): Promise<PlanMealSummary[]> => {
  const { data } = await api.get('/plan-meal')
  return data
}
