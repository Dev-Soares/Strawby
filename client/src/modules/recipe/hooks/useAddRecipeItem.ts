import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addRecipeItemService } from '../service/addRecipeItemService'
import type { AddRecipeItemData } from '../types/addRecipeItem'

export const useAddRecipeItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: string; dto: AddRecipeItemData }) =>
      addRecipeItemService(recipeId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] })
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
