import { useQuery } from '@tanstack/react-query'
import { getDailyScoresService } from '../service/getDailyScoresService'

export const useGetDailyScores = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['daily-scores', startDate, endDate],
    queryFn: () => getDailyScoresService({ startDate, endDate }),
  })
}
