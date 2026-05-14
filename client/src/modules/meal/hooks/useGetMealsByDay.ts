import { useQuery } from '@tanstack/react-query'
import { getMealsByDayService } from '../service/getMealsByDayService'

export const useGetMealsByDay = (day: string) => {
  return useQuery({
    queryKey: ['meals', day],
    queryFn: () => getMealsByDayService(day),
  })
}
