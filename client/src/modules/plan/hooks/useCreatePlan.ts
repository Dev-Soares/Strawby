import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { createPlanService } from '../service/createPlanService'
import type { CreatePlanData } from '../types/createPlan'

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: CreatePlanData) => createPlanService(user!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
      toast.success('Plano criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar o plano. Tente novamente.')
    },
  })
}
