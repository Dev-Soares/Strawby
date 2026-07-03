import { api } from '@/api/axios'

export const deletePatientWeightService = async (
  patientId: string,
  recordId: string,
): Promise<void> => {
  await api.delete(`/patient-weight/${patientId}/${recordId}`)
}
