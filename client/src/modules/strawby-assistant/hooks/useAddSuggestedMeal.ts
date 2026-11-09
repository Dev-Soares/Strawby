import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addSuggestedMealService } from '../service/addSuggestedMealService'

export const useAddSuggestedMeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addSuggestedMealService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}
