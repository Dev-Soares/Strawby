import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getPrivateFoodsService } from '../service/getPrivateFoodsService'

export const useGetPrivateFoods = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['privateFoods'],
    queryFn: () => getPrivateFoodsService(user!.id),
    enabled: !!user?.id,
  })
}
