import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { addMealItemService } from '../service/addMealItemService'
import { toLocalISODate } from '@/shared/utils/date'
import type { AddMealItemData } from '../types/addMealItem'

export const useAddMealItem = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, dto }: { mealId: string; dto: AddMealItemData }) =>
      addMealItemService(effectivePatientId!, mealId, dto),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      await queryClient.refetchQueries({ queryKey: ['meals'], type: 'all' })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Alimento adicionado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao adicionar alimento. Tente novamente.')
    },
  })
}
