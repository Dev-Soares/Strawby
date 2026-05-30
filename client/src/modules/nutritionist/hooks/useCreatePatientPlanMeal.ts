import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createMealService } from '../../meal/service/createMealService'

export const useCreatePatientPlanMeal = (patientId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mealType: string) =>
      createMealService(patientId, { kind: 'PLAN', mealType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', 'plan', patientId] })
      toast.success('Refeição planejada criada!')
    },
    onError: () => {
      toast.error('Erro ao criar refeição.')
    },
  })
}
