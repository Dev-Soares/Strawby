import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { editPlanService } from '../service/editPlanService'

export const useEditPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editPlanService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
      toast.success('Plano atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar o plano. Tente novamente.')
    },
  })
}
