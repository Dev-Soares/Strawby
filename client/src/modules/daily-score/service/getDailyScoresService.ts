import { api } from '@/api/axios'
import type { DailyScore } from '../types/dailyScore'

export const getDailyScoresService = async (): Promise<DailyScore[]> => {
  const { data } = await api.get('/daily-score')
  return data
}
