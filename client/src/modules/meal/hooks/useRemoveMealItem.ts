import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeMealItemService } from '../service/removeMealItemService'

export const useRemoveMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mealId, itemId }: { mealId: string; itemId: string }) =>
      removeMealItemService(mealId, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}
