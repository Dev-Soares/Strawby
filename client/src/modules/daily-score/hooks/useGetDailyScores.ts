import { useQuery } from '@tanstack/react-query'
import { getDailyScoresService } from '../service/getDailyScoresService'

export const useGetDailyScores = () => {
  return useQuery({
    queryKey: ['daily-scores'],
    queryFn: getDailyScoresService,
  })
}
