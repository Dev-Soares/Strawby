import { api } from '@/api/axios'

export type Plan = {
  id: string
  calories: number
  protein: number
  carbs: number
  fat: number
  userId: string
}

export const getPlanService = async (): Promise<Plan> => {
  const { data } = await api.get<Plan>('/plan')
  return data
}
