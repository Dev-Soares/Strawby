import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { confirmPlanService } from '../service/confirmPlanService'
import type { ConfirmPlanData } from '../types/planGeneration'

/**
 * Quem publica a fala de volta é o `confirmPlanDraft`, depois da pausa mínima:
 * o salvamento responde em milissegundos e anexar aqui fazia o mascote pular
 * de "pensando" pra comemoração num piscar.
 */
export const useConfirmPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ConfirmPlanData) => confirmPlanService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan'] })
    },
    onError: () => {
      toast.error('Erro ao salvar o plano. Tente novamente.')
    },
  })
}
