import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { getRecipesService } from '../service/getRecipesService'

export const useGetRecipes = () => {
  const { data: user } = useAuth()
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipesService(user!.id),
    enabled: !!user?.id,
  })
}
