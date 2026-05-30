import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { createMealService } from '../service/createMealService'
import type { CreateMealData } from '../types/createMeal'

export const useCreateMeal = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: CreateMealData) => createMealService(user!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', new Date().toISOString().split('T')[0]] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Refeicao criada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar refeicao. Tente novamente.')
    },
  })
}
