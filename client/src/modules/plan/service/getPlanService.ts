import { api } from '@/api/axios'
import axios from 'axios'

export type Plan = {
  id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  userId: string
}

export const getPlanService = async (): Promise<Plan | null> => {
  try {
    const { data } = await api.get<Plan>('/plan')
    return data ?? null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
