import { api } from '@/api/axios'
import type { NutritionistPatient } from '../types/patient'

export const getPatientsService = async (): Promise<NutritionistPatient[]> => {
  const { data } = await api.get<NutritionistPatient[]>('/nutritionist/me/patients')
  return data
}
