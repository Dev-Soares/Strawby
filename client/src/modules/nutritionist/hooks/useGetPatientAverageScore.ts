import { useQuery } from '@tanstack/react-query'
import { getAverageScoreService } from '../../daily-score/service/getAverageScoreService'

export const useGetPatientAverageScore = (patientId: string) => {
  return useQuery({
    queryKey: ['daily-score', 'average', patientId],
    queryFn: () => getAverageScoreService(patientId),
  })
}
