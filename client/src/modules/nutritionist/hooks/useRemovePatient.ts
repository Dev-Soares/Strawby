import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { removePatientService } from '../service/removePatientService'

export const useRemovePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (patientId: string) => removePatientService(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patients'] })
      toast.success('Paciente removido')
    },
    onError: () => {
      toast.error('Erro ao remover paciente')
    },
  })
}
