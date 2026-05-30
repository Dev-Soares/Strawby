import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { addMealItemService } from '../service/addMealItemService'
import type { AddMealItemData } from '../types/addMealItem'

export const useAddMealItem = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealItemData }) =>
      addMealItemService(user!.id, mealId, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', new Date().toISOString().split('T')[0]] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
