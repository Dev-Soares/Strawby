import { api } from '@/api/axios'
import type { Patient } from '../types/patient'

export const getPatientService = async (id: string): Promise<Patient> => {
  const { data } = await api.get<Patient>(`/patient/${id}`)
  return data
}
