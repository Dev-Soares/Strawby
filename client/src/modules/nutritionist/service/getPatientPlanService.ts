import { api } from '@/api/axios'
import axios from 'axios'
import type { Plan } from '../../plan/types/plan'

export const getPatientPlanService = async (patientId: string): Promise<Plan | null> => {
  try {
    const { data } = await api.get<Plan>(`/plan/${patientId}`)
    return data ?? null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
