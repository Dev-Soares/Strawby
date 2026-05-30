import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getMealService } from '../service/getMealService'

export const useGetMeal = (id: string) => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => getMealService(user!.id, id),
    enabled: !!user?.id && !!id,
  })
}
