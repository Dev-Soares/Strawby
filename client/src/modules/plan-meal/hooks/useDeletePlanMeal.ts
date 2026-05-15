import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePlanMealService } from '../service/deletePlanMealService'

export const useDeletePlanMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePlanMealService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-meals'] })
      toast.success('Refeição planejada removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover refeição planejada. Tente novamente.')
    },
  })
}
