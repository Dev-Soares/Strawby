import { useQuery } from '@tanstack/react-query'
import { getPrivateFoodsService } from '../service/getPrivateFoodsService'

export const useGetPrivateFoods = () => {
  return useQuery({
    queryKey: ['privateFoods'],
    queryFn: getPrivateFoodsService,
  })
}
