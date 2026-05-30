import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePlanService } from '../service/deletePlanService'

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePlanService,
    onSuccess: () => {
      queryClient.setQueryData(['plan'], null)
    },
    onError: () => {
      toast.error('Erro ao deletar o plano. Tente novamente.')
    },
  })
}
