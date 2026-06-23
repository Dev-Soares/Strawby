import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { updateMealItemService } from '../service/updateMealItemService'
import { toLocalISODate } from '@/shared/utils/date'

export const useUpdateMealItem = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, itemId, quantity }: { mealId: string; itemId: string; quantity: number }) =>
      updateMealItemService(effectivePatientId!, mealId, itemId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Quantidade atualizada!')
    },
    onError: () => {
      toast.error('Erro ao atualizar quantidade. Tente novamente.')
    },
  })
}
