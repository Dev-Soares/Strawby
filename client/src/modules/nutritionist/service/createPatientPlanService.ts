import { api } from '@/api/axios'
import type { CreatePlanData } from '../../plan/types/createPlan'
import type { Plan } from '../../plan/types/plan'

export const createPatientPlanService = async (patientId: string, dto: CreatePlanData): Promise<Plan> => {
  const { data } = await api.post<Plan>(`/plan/${patientId}`, dto)
  return data
}
