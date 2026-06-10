import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { forgotPasswordService } from '../service/forgotPasswordService'

export const useResendResetPassword = (email: string) => {
  return useMutation({
    mutationFn: () => forgotPasswordService(email),
    onSuccess: () => {
      toast.success('Novo código enviado para seu e-mail')
    },
    onError: () => {
      toast.error('Não foi possível reenviar o código')
    },
  })
}
