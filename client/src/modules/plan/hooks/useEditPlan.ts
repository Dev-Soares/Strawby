import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editPlanService } from '../service/editPlanService'

export const useEditPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editPlanService,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plan'] }),
  })
}
