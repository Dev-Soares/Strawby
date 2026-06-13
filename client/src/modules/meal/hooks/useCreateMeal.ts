import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { createMealService } from '../service/createMealService'
import { toLocalISODate } from '@/shared/utils/date'
import type { CreateMealData } from '../types/createMeal'

export const useCreateMeal = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: CreateMealData) => createMealService(user!.id, dto),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['meals'], type: 'all' })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', toLocalISODate()] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Refeição criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar refeição. Tente novamente.')
    },
  })
}
