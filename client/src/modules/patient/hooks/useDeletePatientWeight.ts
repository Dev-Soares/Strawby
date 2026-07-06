import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePatientWeightService } from '../service/deletePatientWeightService'

export const useDeletePatientWeight = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (recordId: string) => deletePatientWeightService(patientId, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-weight', patientId] })
      toast.success('Registro de peso removido')
    },
    onError: () => {
      toast.error('Erro ao remover registro')
    },
  })
}
