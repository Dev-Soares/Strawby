import { useQuery } from '@tanstack/react-query'
import { getPlanService } from '../service/getPlanService'

export const useGetPlan = () => {
  return useQuery({ queryKey: ['plan'], queryFn: getPlanService })
}
