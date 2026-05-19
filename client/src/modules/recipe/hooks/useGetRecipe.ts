import { useQuery } from '@tanstack/react-query'
import { getRecipeService } from '../service/getRecipeService'

export const useGetRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeService(id),
    enabled: !!id,
  })
}
