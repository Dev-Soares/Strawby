import { api } from '@/api/axios'
import axios from 'axios'

export type Plan = {
  id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  patientId: string
}

export const getPlanService = async (patientId: string): Promise<Plan | null> => {
  try {
    const { data } = await api.get<Plan>(`/plan/${patientId}`)
    return data ?? null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}
