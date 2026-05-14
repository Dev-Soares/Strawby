import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMealService } from '../service/createMealService'

export const useCreateMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMealService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}
