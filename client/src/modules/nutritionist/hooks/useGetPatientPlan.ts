import { useQuery } from '@tanstack/react-query'
import { getPatientPlanService } from '../service/getPatientPlanService'

export const useGetPatientPlan = (patientId: string) => {
  return useQuery({
    queryKey: ['nutritionist', 'patient-plan', patientId],
    queryFn: () => getPatientPlanService(patientId),
    enabled: !!patientId,
  })
}
