import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { verifyEmailSchema, type VerifyEmailData } from '../types/verifyEmail'
import { verifyEmailService } from '../service/verifyEmailService'

export const useVerifyEmail = () => {
  const navigate = useNavigate()

  const form = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailData) => verifyEmailService(data.code),
    onSuccess: () => {
      toast.success('E-mail verificado com sucesso!')
      navigate('/app/login')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('Código inválido ou expirado')
        return
      }
      toast.error('Não foi possível verificar o e-mail')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
