import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { removePlanMealItemService } from '../service/removePlanMealItemService'

export const useRemovePlanMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ planMealId, itemId }: { planMealId: string; itemId: string }) =>
      removePlanMealItemService(planMealId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-meals'] })
      toast.success('Alimento removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover alimento. Tente novamente.')
    },
  })
}
