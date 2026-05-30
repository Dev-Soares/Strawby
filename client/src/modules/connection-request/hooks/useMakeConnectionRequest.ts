import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeConnectionRequestService } from '../service/makeConnectionRequestService'
import toast from 'react-hot-toast'

export const useMakeConnectionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (code: string) => makeConnectionRequestService(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Solicitação enviada ao nutricionista')
    },
    onError: () => {
      toast.error('Código inválido ou nutricionista não encontrado')
    },
  })
}
