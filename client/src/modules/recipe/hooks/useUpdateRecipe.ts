import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { updateRecipeService } from '../service/updateRecipeService'

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRecipeService(user!.id, id, name),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['recipe', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Receita atualizada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar receita. Tente novamente.')
    },
  })
}
