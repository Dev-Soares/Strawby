import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getMealService } from '../service/getMealService'

export const useGetMeal = (id: string, patientId?: string) => {
  const { data: user } = useAuth()
  const effectivePatientId = patientId ?? user?.id
  return useQuery({
    queryKey: ['meal', id, effectivePatientId],
    queryFn: () => getMealService(effectivePatientId!, id),
    enabled: !!effectivePatientId && !!id,
  })
}
