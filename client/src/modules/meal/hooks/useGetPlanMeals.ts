import { useQuery } from '@tanstack/react-query'
import { getPlanMealsService } from '../service/getPlanMealsService'
import type { Meal } from '../types/meal'

export const useGetPlanMeals = () => {
  return useQuery<Meal[]>({ queryKey: ['meals', 'plan'], queryFn: getPlanMealsService })
}
