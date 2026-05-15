import { api } from '@/api/axios'
import type { CreatePlanMealData } from '../types/createPlanMeal'
import type { PlanMeal } from '../types/planMeal'

export const createPlanMealService = async (dto: CreatePlanMealData): Promise<PlanMeal> => {
  const { data } = await api.post('/plan-meal', dto)
  return data
}
