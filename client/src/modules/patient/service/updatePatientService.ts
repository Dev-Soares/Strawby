import { api } from '@/api/axios'

export type UpdatePatientPayload = {
  height?: number
  birthDate?: string
  gender?: 'male' | 'female'
  targetWeight?: number
}

export const updatePatientService = async (id: string, data: UpdatePatientPayload): Promise<void> => {
  await api.patch(`/patient/${id}`, data)
}
