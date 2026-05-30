import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deletePrivateFoodService } from '../service/deletePrivateFoodService'

export const useDeletePrivateFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePrivateFoodService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privateFoods'] })
      toast.success('Alimento removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover alimento. Tente novamente.')
    },
  })
}
