import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPlanMealService } from '../service/createPlanMealService'

export const useCreatePlanMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPlanMealService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-meals'] })
      toast.success('Refeição planejada criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar refeição planejada. Tente novamente.')
    },
  })
}
