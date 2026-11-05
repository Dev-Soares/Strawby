import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { previewPlanService } from '../service/previewPlanService'
import type { PreviewPlanData } from '../types/planGeneration'

/**
 * Não anexa a resposta no cache aqui: o `submitPlan` segura a fala até o tempo
 * de "pensando" fechar — anexar no `onSuccess` fazia a resposta atropelar o
 * indicador de digitação.
 */
export const usePreviewPlan = () => {
  return useMutation({
    mutationFn: (data: PreviewPlanData) => previewPlanService(data),
    onError: () => {
      toast.error('Erro ao calcular o plano. Tente novamente.')
    },
  })
}
