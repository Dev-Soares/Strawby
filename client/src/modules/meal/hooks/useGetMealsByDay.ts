import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getMealsByDayService } from '../service/getMealsByDayService'

export const useGetMealsByDay = (day: string) => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['meals', day],
    queryFn: () => getMealsByDayService(user!.id, day),
    enabled: !!user?.id && !!day,
    placeholderData: keepPreviousData,
  })
}
