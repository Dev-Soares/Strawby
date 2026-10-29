import { useQuery } from '@tanstack/react-query'
import { getPlanMealsService } from '../../meal/service/getPlanMealsService'
import { sortMealsByTime } from '@/shared/utils/sortMealsByTime'

export const useGetPatientPlanMeals = (patientId: string) => {
  return useQuery({
    queryKey: ['meals', 'plan', patientId],
    queryFn: () => getPlanMealsService(patientId),
    enabled: !!patientId,
    select: sortMealsByTime,
  })
}
