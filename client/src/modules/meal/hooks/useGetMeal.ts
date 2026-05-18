import { useQuery } from '@tanstack/react-query'
import { getMealService } from '../service/getMealService'

export const useGetMeal = (id: string) => {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => getMealService(id),
    enabled: !!id,
  })
}
