import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addMealPrivateFoodItemService } from '../service/addMealPrivateFoodItemService'
import type { AddMealPrivateFoodItemData } from '../types/addMealPrivateFoodItem'

export const useAddMealPrivateFoodItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealPrivateFoodItemData }) =>
      addMealPrivateFoodItemService(mealId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
