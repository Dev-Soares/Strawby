import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPlanMealItemService } from '../service/addPlanMealItemService'
import type { AddPlanMealItemData } from '../types/addPlanMealItem'

export const useAddPlanMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ planMealId, dto }: { planMealId: string; dto: AddPlanMealItemData }) =>
      addPlanMealItemService(planMealId, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan-meals'] }),
  })
}
