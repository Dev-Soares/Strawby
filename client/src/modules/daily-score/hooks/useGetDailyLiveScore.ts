import { useQuery } from '@tanstack/react-query'
import { getDailyLiveScoreService } from '../service/getDailyLiveScoreService'

export const useGetDailyLiveScore = (day: string) => {
  return useQuery({
    queryKey: ['daily-score-live', day],
    queryFn: () => getDailyLiveScoreService(day),
    enabled: !!day,
  })
}
