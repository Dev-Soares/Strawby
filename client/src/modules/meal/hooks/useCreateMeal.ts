import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createMealService } from '../service/createMealService'

export const useCreateMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMealService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Refeição criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar refeição. Tente novamente.')
    },
  })
}
