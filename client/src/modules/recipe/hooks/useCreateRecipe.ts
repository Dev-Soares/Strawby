import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { createRecipeService } from '../service/createRecipeService'
import type { CreateRecipeData } from '../types/createRecipe'

export const useCreateRecipe = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: CreateRecipeData) => createRecipeService(user!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Receita criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar receita. Tente novamente.')
    },
  })
}
