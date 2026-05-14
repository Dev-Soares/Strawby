import { useQuery } from '@tanstack/react-query'
import { getPlanMealsService } from '../service/getPlanMealsService'

export const useGetPlanMeals = () => {
  return useQuery({ queryKey: ['meals', 'plan'], queryFn: getPlanMealsService })
}
