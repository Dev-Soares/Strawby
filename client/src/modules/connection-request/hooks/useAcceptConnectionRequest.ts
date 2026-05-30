import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptConnectionRequestService } from '../service/acceptConnectionRequestService'
import toast from 'react-hot-toast'

export const useAcceptConnectionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => acceptConnectionRequestService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] })
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'patients'] })
      toast.success('Solicitação aceita')
    },
    onError: () => {
      toast.error('Erro ao aceitar solicitação')
    },
  })
}
