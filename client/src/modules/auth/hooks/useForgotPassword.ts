import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { forgotPasswordSchema, type ForgotPasswordData } from '../types/forgotPassword'
import { forgotPasswordService } from '../service/forgotPasswordService'

export const useForgotPassword = () => {
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const navigateToReset = () => {
    navigate('/app/reset-password', { state: { email: form.getValues('email') } })
  }

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPasswordService(data.email),
    onSuccess: navigateToReset,
    onError: (error) => {
      // Navigate anyway on 404 to prevent email enumeration
      if (isAxiosError(error) && error.response?.status === 404) {
        navigateToReset()
        return
      }
      toast.error('Não foi possível enviar o e-mail de redefinição')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
