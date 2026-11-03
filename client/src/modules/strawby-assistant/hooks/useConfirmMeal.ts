import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { confirmMealService } from '../service/confirmMealService'
import { ASSISTANT_CHAT_QUERY_KEY } from './useGetAssistantChat'
import type { AssistantMessage, ConfirmMealData } from '../types/chat'

export const useConfirmMeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ConfirmMealData) => confirmMealService(data),
    onSuccess: (reply) => {
      queryClient.setQueryData<AssistantMessage[]>(ASSISTANT_CHAT_QUERY_KEY, (old = []) => [
        ...old,
        reply,
      ])
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
    onError: () => {
      toast.error('Erro ao adicionar a refeição. Tente novamente.')
    },
  })
}
