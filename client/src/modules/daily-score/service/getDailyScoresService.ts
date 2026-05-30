import { api } from '@/api/axios'
import type { DailyScore } from '../types/dailyScore'

export const getDailyScoresService = async (patientId: string, { startDate, endDate }: { startDate: string; endDate: string }): Promise<DailyScore[]> => {
  const { data } = await api.get(`/daily-score/${patientId}`, { params: { startDate, endDate } })
  return data
}
