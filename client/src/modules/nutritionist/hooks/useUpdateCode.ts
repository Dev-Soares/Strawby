import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateCodeService } from '../service/updateCodeService'
import type { UpdateCodeData } from '../types/updateCode'

export const useUpdateCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: UpdateCodeData) => updateCodeService(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionist', 'me'] })
      toast.success('Código atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar código. Tente outro.')
    },
  })
}
