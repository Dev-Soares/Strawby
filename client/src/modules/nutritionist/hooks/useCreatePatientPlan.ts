import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPatientPlanService } from '../service/createPatientPlanService'
import type { CreatePlanData } from '../../plan/types/createPlan'

export const useCreatePatientPlan = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreatePlanData) => createPatientPlanService(patientId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patient-plan', patientId] })
      toast.success('Plano criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar o plano. Tente novamente.')
    },
  })
}
