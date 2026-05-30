import { api } from '@/api/axios'
import type { PlanData } from '../types/plan'
import type { Plan } from './getPlanService'

export const editPlanService = async (patientId: string, dto: PlanData): Promise<Plan> => {
  const { data } = await api.patch<Plan>(`/plan/${patientId}`, dto)
  return data
}
