import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cancelConnectionRequestService } from '../service/cancelConnectionRequestService'

export const useCancelConnectionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelConnectionRequestService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] })
      toast.success('Solicitação cancelada')
    },
    onError: () => {
      toast.error('Erro ao cancelar solicitação')
    },
  })
}
