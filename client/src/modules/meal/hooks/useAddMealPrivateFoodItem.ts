import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { addMealPrivateFoodItemService } from '../service/addMealPrivateFoodItemService'
import type { AddMealPrivateFoodItemData } from '../types/addMealPrivateFoodItem'

export const useAddMealPrivateFoodItem = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealPrivateFoodItemData }) =>
      addMealPrivateFoodItemService(effectivePatientId!, mealId, dto),
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
