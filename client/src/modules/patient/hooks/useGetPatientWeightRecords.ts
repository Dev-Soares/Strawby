import { useQuery } from '@tanstack/react-query'
import { getPatientWeightRecordsService } from '../service/getPatientWeightRecordsService'

export const useGetPatientWeightRecords = (patientId: string) => {
  return useQuery({
    queryKey: ['patient-weight', patientId],
    queryFn: () => getPatientWeightRecordsService(patientId),
    enabled: !!patientId,
  })
}
