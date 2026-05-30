import { useQuery } from '@tanstack/react-query'
import { getPatientsService } from '../service/getPatientsService'

export const useGetPatients = () => {
  return useQuery({
    queryKey: ['nutritionist', 'patients'],
    queryFn: getPatientsService,
  })
}
