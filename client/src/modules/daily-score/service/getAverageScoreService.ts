import { api } from '@/api/axios'

export const getAverageScoreService = async (patientId: string): Promise<{ score: number }> => {
  const { data } = await api.get(`/daily-score/${patientId}/average`)
  return data
}
