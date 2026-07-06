import { useQuery } from '@tanstack/react-query'
import { getConnectionRequestHistoryService } from '../service/getConnectionRequestHistoryService'

export const useGetConnectionRequestHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['connection-requests', 'history'],
    queryFn: getConnectionRequestHistoryService,
    enabled,
  })
}
