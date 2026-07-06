import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createMealService } from '../../meal/service/createMealService'

export const useCreatePatientPlanMeal = (patientId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (mealType: string) =>
      createMealService(patientId, { kind: 'PLAN', mealType }),
    onSuccess: (meal) => {
      queryClient.invalidateQueries({ queryKey: ['meals', 'plan', patientId] })
      toast.success('Refeição planejada criada!')
      navigate(`/app/meals/${meal.id}?patientId=${patientId}`)
    },
    onError: () => {
      toast.error('Erro ao criar refeição.')
    },
  })
}
