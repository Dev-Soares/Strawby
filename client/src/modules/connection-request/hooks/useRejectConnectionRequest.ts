import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectConnectionRequestService } from '../service/rejectConnectionRequestService'
import toast from 'react-hot-toast'

export const useRejectConnectionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rejectConnectionRequestService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] })
      toast.success('Solicitação recusada')
    },
    onError: () => {
      toast.error('Erro ao recusar solicitação')
    },
  })
}
