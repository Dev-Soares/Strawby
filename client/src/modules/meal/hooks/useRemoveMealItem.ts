import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { removeMealItemService } from '../service/removeMealItemService'
import { toLocalISODate } from '@/shared/utils/date'

export const useRemoveMealItem = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, itemId }: { mealId: string; itemId: string }) =>
      removeMealItemService(effectivePatientId!, mealId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Alimento removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover alimento. Tente novamente.')
    },
  })
}
