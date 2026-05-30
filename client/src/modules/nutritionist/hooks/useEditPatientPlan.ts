import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { editPlanService } from '../../plan/service/editPlanService'
import type { PlanData } from '../../plan/types/plan'

export const useEditPatientPlan = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: PlanData) => editPlanService(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patient-plan', patientId] })
      toast.success('Plano atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar o plano.')
    },
  })
}
