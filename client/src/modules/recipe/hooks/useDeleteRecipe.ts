import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { deleteRecipeService } from '../service/deleteRecipeService'

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (id: string) => deleteRecipeService(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Receita removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover receita. Tente novamente.')
    },
  })
}
