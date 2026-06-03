import { api } from '@/api/axios'
import type { PlanData, Plan } from '../types/plan'

export const editPlanService = async (patientId: string, dto: PlanData): Promise<Plan> => {
  const { data } = await api.patch<Plan>(`/plan/${patientId}`, dto)
  return data
}
