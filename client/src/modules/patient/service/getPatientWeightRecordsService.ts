import { api } from '@/api/axios'

export type WeightRecord = {
  id: string
  weight: number
  date: string
}

export const getPatientWeightRecordsService = async (patientId: string): Promise<WeightRecord[]> => {
  const { data } = await api.get(`/patient-weight/${patientId}`)
  return data
}
