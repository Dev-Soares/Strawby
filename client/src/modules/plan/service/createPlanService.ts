import { api } from '@/api/axios'
import type { CreatePlanData } from '../types/createPlan'
import type { Plan } from './getPlanService'

export const createPlanService = async (patientId: string, dto: CreatePlanData): Promise<Plan> => {
  const { data } = await api.post<Plan>(`/plan/${patientId}`, dto)
  return data
}
