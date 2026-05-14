import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePlanMealService } from '../service/deletePlanMealService'

export const useDeletePlanMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePlanMealService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan-meals'] }),
  })
}
