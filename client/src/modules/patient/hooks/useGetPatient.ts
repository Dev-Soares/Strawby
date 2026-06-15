import { useQuery } from '@tanstack/react-query'
import { getPatientService } from '../service/getPatientService'

export const useGetPatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientService(id),
    enabled: !!id,
  })
}
