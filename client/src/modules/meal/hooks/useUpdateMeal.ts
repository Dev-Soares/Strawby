import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { updateMealService } from '../service/updateMealService'
import type { UpdateMealData } from '../types/updateMeal'

export const useUpdateMeal = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, data }: { mealId: string; data: UpdateMealData }) =>
      updateMealService(effectivePatientId!, mealId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Refeição atualizada!')
    },
    onError: () => {
      toast.error('Erro ao atualizar refeição. Tente novamente.')
    },
  })
}
