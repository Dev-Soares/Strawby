import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getDailyScoresService } from '../service/getDailyScoresService'

export const useGetDailyScores = (startDate: string, endDate: string) => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['daily-scores', startDate, endDate],
    queryFn: () => getDailyScoresService(user!.id, { startDate, endDate }),
    enabled: !!user?.id,
    placeholderData: keepPreviousData,
  })
}
