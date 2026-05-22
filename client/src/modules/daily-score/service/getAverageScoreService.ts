import { api } from '@/api/axios'

export const getAverageScoreService = async (): Promise<{ score: number }> => {
  const { data } = await api.get('/daily-score/average')
  return data
}
