import { api } from '@/api/axios'
import type { DailyScore } from '../types/dailyScore'

export const getDailyScoresService = async ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): Promise<DailyScore[]> => {
  const { data } = await api.get('/daily-score', {
    params: { startDate, endDate },
  })
  return data
}
