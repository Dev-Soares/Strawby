import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { removeRecipeItemService } from '../service/removeRecipeItemService'

export const useRemoveRecipeItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ recipeId, itemId }: { recipeId: string; itemId: string }) =>
      removeRecipeItemService(recipeId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Alimento removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover alimento. Tente novamente.')
    },
  })
}
