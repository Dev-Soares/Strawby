import { useQuery } from '@tanstack/react-query'
import { getConnectionRequestsService } from '../service/getConnectionRequestsService'

export const useGetConnectionRequests = () => {
  return useQuery({
    queryKey: ['connection-requests'],
    queryFn: getConnectionRequestsService,
  })
}
