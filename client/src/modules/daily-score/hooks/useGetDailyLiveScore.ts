import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getDailyLiveScoreService } from '../service/getDailyLiveScoreService'

export const useGetDailyLiveScore = (day: string) => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['daily-score-live', day],
    queryFn: () => getDailyLiveScoreService(user!.id, day),
    enabled: !!user?.id && !!day,
  })
}
