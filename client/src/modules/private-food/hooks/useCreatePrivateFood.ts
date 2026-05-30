import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createPrivateFoodService } from '../service/createPrivateFoodService'
import type { CreatePrivateFoodData } from '../types/privateFood'

export const useCreatePrivateFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreatePrivateFoodData) => createPrivateFoodService(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privateFoods'] })
      toast.success('Alimento criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar alimento. Tente novamente.')
    },
  })
}
