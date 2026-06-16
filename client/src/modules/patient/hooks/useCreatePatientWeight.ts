import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  createPatientWeightService,
  type CreatePatientWeightPayload,
} from '../service/createPatientWeightService'

export const useCreatePatientWeight = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientWeightPayload) =>
      createPatientWeightService(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-weight', patientId] })
      toast.success('Peso registrado!')
    },
    onError: () => {
      toast.error('Erro ao registrar peso')
    },
  })
}
