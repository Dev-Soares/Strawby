import { useQuery } from '@tanstack/react-query'
import { getRecipesService } from '../service/getRecipesService'

export const useGetRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipesService,
  })
}
