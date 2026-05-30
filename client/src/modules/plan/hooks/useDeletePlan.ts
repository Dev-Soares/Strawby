import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { deletePlanService } from '../service/deletePlanService'

export const useDeletePlan = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: () => deletePlanService(user!.id),
    onSuccess: () => {
      queryClient.setQueryData(['plan'], null)
    },
    onError: () => {
      toast.error('Erro ao deletar o plano. Tente novamente.')
    },
  })
}
