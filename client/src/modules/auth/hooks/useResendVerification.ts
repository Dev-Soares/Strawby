import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import { resendVerificationService } from '../service/resendVerificationService'

export const useResendVerification = (email: string) => {
  return useMutation({
    mutationFn: () => resendVerificationService(email),
    onSuccess: () => {
      toast.success('Código reenviado! Verifique seu e-mail.')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 400) {
        toast.error('E-mail já verificado')
        return
      }
      if (isAxiosError(error) && error.response?.status === 404) {
        toast.error('E-mail não encontrado')
        return
      }
      toast.error('Não foi possível reenviar o código')
    },
  })
}
