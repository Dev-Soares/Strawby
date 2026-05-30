import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { addRecipeItemService } from '../service/addRecipeItemService'
import type { AddRecipeItemData } from '../types/addRecipeItem'

export const useAddRecipeItem = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: ({ recipeId, dto }: { recipeId: string; dto: AddRecipeItemData }) =>
      addRecipeItemService(user!.id, recipeId, dto),
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
