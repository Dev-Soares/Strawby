import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createRecipeService } from '../service/createRecipeService'

export const useCreateRecipe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRecipeService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Receita criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar receita. Tente novamente.')
    },
  })
}
