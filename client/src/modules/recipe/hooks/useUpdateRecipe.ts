import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateRecipeService } from '../service/updateRecipeService'

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRecipeService(id, name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] })
      toast.success('Receita atualizada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar receita. Tente novamente.')
    },
  })
}
