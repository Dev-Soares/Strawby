import { api } from '@/api/axios'

export const getDailyLiveScoreService = async (patientId: string, day: string): Promise<number> => {
  const { data } = await api.get(`/daily-score/${patientId}/live/${day}`)
  return data
}
