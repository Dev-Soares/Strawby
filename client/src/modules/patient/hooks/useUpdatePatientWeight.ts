import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  updatePatientWeightService,
  type UpdatePatientWeightPayload,
} from '../service/updatePatientWeightService'

export const useUpdatePatientWeight = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: UpdatePatientWeightPayload }) =>
      updatePatientWeightService(patientId, recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-weight', patientId] })
      toast.success('Peso atualizado!')
    },
    onError: () => {
      toast.error('Erro ao atualizar peso')
    },
  })
}
