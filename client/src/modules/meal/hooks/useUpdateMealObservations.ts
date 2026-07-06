import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { updateMealObservationsService } from '../service/updateMealObservationsService'

export const useUpdateMealObservations = (patientId?: string) => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useMutation({
    mutationFn: ({ mealId, observations }: { mealId: string; observations: string | null }) =>
      updateMealObservationsService(effectivePatientId!, mealId, observations),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal', variables.mealId] })
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      toast.success('Observações salvas!')
    },
    onError: () => {
      toast.error('Erro ao salvar observações. Tente novamente.')
    },
  })
}
