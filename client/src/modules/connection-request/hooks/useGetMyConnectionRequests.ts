import { useQuery } from '@tanstack/react-query'
import { getMyConnectionRequestsService } from '../service/getMyConnectionRequestsService'

export const useGetMyConnectionRequests = (enabled = true) => {
  return useQuery({
    queryKey: ['connection-requests', 'mine'],
    queryFn: getMyConnectionRequestsService,
    enabled,
  })
}
