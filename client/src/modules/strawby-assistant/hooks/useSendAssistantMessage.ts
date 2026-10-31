import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { sendAssistantMessageService } from '../service/sendAssistantMessageService'
import type { SendAssistantMessageData } from '../types/chat'

export const useSendAssistantMessage = () => {
  return useMutation({
    mutationFn: (dto: SendAssistantMessageData) => sendAssistantMessageService(dto),
    onError: () => {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    },
  })
}
