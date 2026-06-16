import { api } from '@/api/axios'

export type UpdatePatientWeightPayload = {
  weight?: number
  date?: string
}

export const updatePatientWeightService = async (
  patientId: string,
  recordId: string,
  data: UpdatePatientWeightPayload,
): Promise<void> => {
  await api.patch(`/patient-weight/${patientId}/${recordId}`, data)
}
