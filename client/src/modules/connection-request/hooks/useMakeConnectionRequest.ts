import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { makeConnectionRequestService } from '../service/makeConnectionRequestService'
import toast from 'react-hot-toast'

export const useMakeConnectionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (code: string) => makeConnectionRequestService(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['connection-requests'] })
      toast.success('Solicitação enviada ao nutricionista')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('Você já possui uma solicitação de conexão pendente')
        return
      }
      toast.error('Código inválido ou nutricionista não encontrado')
    },
  })
}
