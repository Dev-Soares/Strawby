import { api } from '@/api/axios'

export const removePatientService = async (patientId: string): Promise<void> => {
  await api.delete(`/nutritionist/me/patients/${patientId}`)
}
