import { useQuery } from '@tanstack/react-query'
import { getNutritionistService } from '../service/getNutritionistService'

export const useGetNutritionist = () => {
  return useQuery({
    queryKey: ['nutritionist', 'me'],
    queryFn: getNutritionistService,
  })
}
