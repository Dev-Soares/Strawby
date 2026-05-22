import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { removeMealRecipeService } from '../service/removeMealRecipeService'

export const useRemoveMealRecipe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mealId, recipeId }: { mealId: string; recipeId: string }) =>
      removeMealRecipeService(mealId, recipeId),
    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({ queryKey: ['meal', variables.mealId], type: 'all' })
      await queryClient.refetchQueries({ queryKey: ['meals'], type: 'all' })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', new Date().toISOString().split('T')[0]] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Receita removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover receita. Tente novamente.')
    },
  })
}
