import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addMealItemService } from '../service/addMealItemService'
import type { AddMealItemData } from '../types/addMealItem'

export const useAddMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealItemData }) =>
      addMealItemService(mealId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
