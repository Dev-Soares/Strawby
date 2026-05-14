import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlanMealService } from '../service/createPlanMealService'

export const useCreatePlanMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPlanMealService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan-meals'] }),
  })
}
