import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removePlanMealItemService } from '../service/removePlanMealItemService'

export const useRemovePlanMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ planMealId, itemId }: { planMealId: string; itemId: string }) =>
      removePlanMealItemService(planMealId, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan-meals'] }),
  })
}
