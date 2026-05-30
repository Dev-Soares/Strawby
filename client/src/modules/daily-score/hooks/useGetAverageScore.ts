import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getAverageScoreService } from '../service/getAverageScoreService'

export const useGetAverageScore = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['daily-score', 'average'],
    queryFn: () => getAverageScoreService(user!.id),
    enabled: !!user?.id,
  })
}
