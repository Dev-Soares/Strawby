import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getRecipeService } from '../service/getRecipeService'

export const useGetRecipe = (id: string) => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeService(user!.id, id),
    enabled: !!user?.id && !!id,
  })
}
