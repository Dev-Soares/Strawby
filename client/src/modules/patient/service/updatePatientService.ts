import { api } from '@/api/axios'

export type UpdatePatientPayload = {
  height?: number
  birthDate?: string
  gender?: 'male' | 'female'
  goal?: 'lose' | 'gain' | 'mantain'
}

export const updatePatientService = async (id: string, data: UpdatePatientPayload): Promise<void> => {
  await api.patch(`/patient/${id}`, data)
}
