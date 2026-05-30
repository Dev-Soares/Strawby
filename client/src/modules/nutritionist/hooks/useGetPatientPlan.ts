import { useQuery } from '@tanstack/react-query'
import { getPlanService } from '../../plan/service/getPlanService'

export const useGetPatientPlan = (patientId: string) => {
  return useQuery({
    queryKey: ['nutritionist', 'patient-plan', patientId],
    queryFn: () => getPlanService(patientId),
    enabled: !!patientId,
  })
}
