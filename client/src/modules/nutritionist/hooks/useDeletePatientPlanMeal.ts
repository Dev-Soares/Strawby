import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteMealService } from '../../meal/service/deleteMealService'

export const useDeletePatientPlanMeal = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mealId: string) => deleteMealService(patientId, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', 'plan', patientId] })
      toast.success('Refeição removida.')
    },
    onError: () => {
      toast.error('Erro ao remover refeição.')
    },
  })
}
