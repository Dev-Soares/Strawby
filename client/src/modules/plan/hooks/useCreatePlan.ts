import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPlanService } from '../service/createPlanService'

export const useCreatePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPlanService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
      toast.success('Plano criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar o plano. Tente novamente.')
    },
  })
}
