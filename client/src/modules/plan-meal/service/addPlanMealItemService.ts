import { api } from '@/api/axios'
import type { AddPlanMealItemData } from '../types/addPlanMealItem'
import type { PlanMealItem } from '../types/planMeal'

export const addPlanMealItemService = async (
  planMealId: string,
  dto: AddPlanMealItemData,
): Promise<PlanMealItem> => {
  const { data } = await api.post(`/plan-meal/${planMealId}/items`, dto)
  return data
}
