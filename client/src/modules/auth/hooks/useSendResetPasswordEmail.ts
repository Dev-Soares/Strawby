import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPasswordService } from '../service/forgotPasswordService'

export const useSendResetPasswordEmail = (email: string) => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => forgotPasswordService(email),
    onSuccess: () => {
      navigate('/app/reset-password', { state: { email } })
    },
    onError: () => {
      toast.error('Não foi possível enviar o e-mail de redefinição')
    },
  })
}
