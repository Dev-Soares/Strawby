import { api } from '@/api/axios'
import type { PatientStreak } from '../types/patientStreak'

export const getPatientStreakService = async (patientId: string): Promise<PatientStreak> => {
  const { data } = await api.get(`/patient/${patientId}/streak`)
  return data
}
