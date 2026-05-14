import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMealService } from '../service/deleteMealService'

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMealService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['meals'] }),
  })
}
