import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDailyScoresService } from '../../daily-score/service/getDailyScoresService'

export const useGetPatientDailyScores = (patientId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['patient-daily-scores', patientId, startDate, endDate],
    queryFn: () => getDailyScoresService(patientId, { startDate, endDate }),
    enabled: !!patientId,
    placeholderData: keepPreviousData,
  })
}
