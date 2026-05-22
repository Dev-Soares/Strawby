import { useQuery } from '@tanstack/react-query'
import { getAverageScoreService } from '../service/getAverageScoreService'

export const useGetAverageScore = () => {
  return useQuery({
    queryKey: ['daily-score', 'average'],
    queryFn: getAverageScoreService,
  })
}
