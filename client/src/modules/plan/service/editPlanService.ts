import { api } from '@/api/axios'
import type { PlanData } from '../types/plan'
import type { Plan } from './getPlanService'

export const editPlanService = async (dto: PlanData): Promise<Plan> => {
  const { data } = await api.patch<Plan>('/plan', dto)
  return data
}
