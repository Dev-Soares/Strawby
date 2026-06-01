import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disconnectNutritionistService } from '../service/disconnectNutritionistService'
import toast from 'react-hot-toast'

export const useDisconnectNutritionist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectNutritionistService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      toast.success('Nutricionista removido')
    },
    onError: () => {
      toast.error('Erro ao remover nutricionista')
    },
  })
}
