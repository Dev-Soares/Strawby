import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { searchFoodService } from '../service/searchFoodService'
import { canSearch } from '../config/search'

export const useSearchFood = (query: string) => {
  const debouncedQuery = useDebounce(query, 400)

  return useQuery({
    queryKey: ['food', 'search', debouncedQuery],
    queryFn: () => searchFoodService(debouncedQuery),
    enabled: canSearch(debouncedQuery),
  })
}
