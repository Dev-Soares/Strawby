import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { deleteMealService } from '../service/deleteMealService'

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (id: string) => deleteMealService(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.invalidateQueries({ queryKey: ['daily-score-live', new Date().toISOString().split('T')[0]] })
      queryClient.invalidateQueries({ queryKey: ['daily-scores'] })
      toast.success('Refeicao removida com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao remover refeicao. Tente novamente.')
    },
  })
}
