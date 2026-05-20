import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addMealRecipeService } from '../service/addMealRecipeService'
import type { AddMealRecipeData } from '../service/addMealRecipeService'

export const useAddMealRecipe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealRecipeData }) =>
      addMealRecipeService(mealId, dto),
    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({ queryKey: ['meal', variables.mealId], type: 'all' })
      await queryClient.refetchQueries({ queryKey: ['meals'], type: 'all' })
      toast.success('Receita adicionada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar receita. Tente novamente.')
    },
  })
}
