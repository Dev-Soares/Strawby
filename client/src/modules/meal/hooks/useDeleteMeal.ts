import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { deleteMealService } from '../service/deleteMealService'
import { toLocalISODate } from '@/shared/utils/date'

export const useDeleteMeal = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: (id: string) => deleteMealService(effectivePatientId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Refeição removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover refeição. Tente novamente.')
    },
  })
}
