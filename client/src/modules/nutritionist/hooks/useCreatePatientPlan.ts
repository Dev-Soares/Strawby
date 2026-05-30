import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPlanService } from '../../plan/service/createPlanService'
import type { CreatePlanData } from '../../plan/types/createPlan'

export const useCreatePatientPlan = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreatePlanData) => createPlanService(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patient-plan', patientId] })
      toast.success('Plano criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar o plano. Tente novamente.')
    },
  })
}
