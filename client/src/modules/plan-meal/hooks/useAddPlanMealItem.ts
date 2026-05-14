import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addPlanMealItemService } from '../service/addPlanMealItemService'
import type { AddPlanMealItemData } from '../types/addPlanMealItem'

export const useAddPlanMealItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ planMealId, dto }: { planMealId: string; dto: AddPlanMealItemData }) =>
      addPlanMealItemService(planMealId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan-meals'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
