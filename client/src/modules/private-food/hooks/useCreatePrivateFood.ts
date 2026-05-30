import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/hooks/useAuth'
import { createPrivateFoodService } from '../service/createPrivateFoodService'
import type { CreatePrivateFoodData } from '../types/privateFood'

export const useCreatePrivateFood = () => {
  const queryClient = useQueryClient()
  const { data: user } = useAuth()
  return useMutation({
    mutationFn: (dto: CreatePrivateFoodData) => createPrivateFoodService(user!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privateFoods'] })
      toast.success('Alimento criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar alimento. Tente novamente.')
    },
  })
}
