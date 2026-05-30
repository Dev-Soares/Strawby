import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { editPlanService } from '../service/editPlanService'
import type { PlanData } from '../types/plan'

export const useEditPlan = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: PlanData) => editPlanService(user!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
      toast.success('Plano atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar o plano. Tente novamente.')
    },
  })
}
