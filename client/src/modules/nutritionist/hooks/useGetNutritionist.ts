import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getNutritionistService } from '../service/getNutritionistService'

export const useGetNutritionist = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['nutritionist', 'me'],
    queryFn: getNutritionistService,
    enabled: user?.role === 'nutritionist',
  })
}
