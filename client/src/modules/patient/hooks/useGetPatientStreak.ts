import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getPatientStreakService } from '../service/getPatientStreakService'

export const useGetPatientStreak = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['patient-streak', user?.id],
    queryFn: () => getPatientStreakService(user!.id),
    enabled: !!user?.id,
  })
}
