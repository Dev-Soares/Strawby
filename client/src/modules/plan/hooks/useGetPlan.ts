import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getPlanService } from '../service/getPlanService'

export const useGetPlan = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['plan', user?.id],
    queryFn: () => getPlanService(user!.id),
    enabled: !!user?.id,
  })
}
