import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { deletePrivateFoodService } from '../service/deletePrivateFoodService'

export const useDeletePrivateFood = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (id: string) => deletePrivateFoodService(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privateFoods'] })
      toast.success('Alimento removido com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover alimento. Tente novamente.')
    },
  })
}
