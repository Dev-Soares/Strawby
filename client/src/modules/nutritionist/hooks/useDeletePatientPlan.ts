import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePlanService } from '../../plan/service/deletePlanService'

export const useDeletePatientPlan = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePlanService(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patient-plan', patientId] })
      toast.success('Plano removido.')
    },
    onError: () => {
      toast.error('Erro ao remover o plano.')
    },
  })
}
