import { api } from '@/api/axios'

export const getDailyLiveScoreService = async (day: string): Promise<number> => {
  const { data } = await api.get(`/daily-score/live/${day}`)
  return data
}
