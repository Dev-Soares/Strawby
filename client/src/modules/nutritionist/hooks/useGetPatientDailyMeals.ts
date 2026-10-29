import { useQuery } from '@tanstack/react-query'
import { getPatientDailyMealsService } from '../service/getPatientDailyMealsService'
import { sortMealsByTime } from '@/shared/utils/sortMealsByTime'

export const useGetPatientDailyMeals = (patientId: string, day: string) => {
  return useQuery({
    queryKey: ['nutritionist', 'patient-diary', patientId, day],
    queryFn: () => getPatientDailyMealsService(patientId, day),
    enabled: !!patientId && !!day,
    select: sortMealsByTime,
  })
}
