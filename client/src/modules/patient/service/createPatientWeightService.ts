import { api } from '@/api/axios'

export type CreatePatientWeightPayload = {
  weight: number
  date: string
}

export const createPatientWeightService = async (
  patientId: string,
  data: CreatePatientWeightPayload,
): Promise<void> => {
  await api.post(`/patient-weight/${patientId}`, data)
}
