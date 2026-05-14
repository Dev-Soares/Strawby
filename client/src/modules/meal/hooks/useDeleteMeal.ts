import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteMealService } from '../service/deleteMealService'

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMealService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Refeição removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover refeição. Tente novamente.')
    },
  })
}
