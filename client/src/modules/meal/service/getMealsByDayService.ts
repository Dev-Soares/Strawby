import { api } from '@/api/axios'
import type { Meal } from '../types/meal'

export const getMealsByDayService = async (day: string): Promise<Meal[]> => {
  const { data } = await api.get(`/meal/day/${day}`)
  return data
}
