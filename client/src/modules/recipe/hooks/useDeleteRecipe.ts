import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteRecipeService } from '../service/deleteRecipeService'

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRecipeService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Receita removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover receita. Tente novamente.')
    },
  })
}
