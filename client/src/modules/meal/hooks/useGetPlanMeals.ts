import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getPlanMealsService } from '../service/getPlanMealsService'
import type { Meal } from '../types/meal'

export const useGetPlanMeals = () => {
  const { data: user } = useAuth()
  return useQuery<Meal[]>({
    queryKey: ['meals', 'plan'],
    queryFn: () => getPlanMealsService(user!.id),
    enabled: !!user?.id,
  })
}
