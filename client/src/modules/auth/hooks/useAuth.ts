import { useQuery } from '@tanstack/react-query'
import { getMeService } from '../service/getMeService'

export const useAuth = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMeService,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}
