import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updatePrivateFoodService } from '../service/updatePrivateFoodService'
import type { UpdatePrivateFoodData } from '../types/privateFood'

export const useUpdatePrivateFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePrivateFoodData }) =>
      updatePrivateFoodService(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privateFoods'] })
      toast.success('Alimento atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar alimento. Tente novamente.')
    },
  })
}
