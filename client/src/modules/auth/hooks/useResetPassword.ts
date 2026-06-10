import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { resetPasswordSchema, type ResetPasswordData } from '../types/resetPassword'
import { resetPasswordService } from '../service/resetPasswordService'

export const useResetPassword = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordData) => resetPasswordService(data.code, data.newPassword),
    onSuccess: async () => {
      toast.success('Senha redefinida com sucesso!')
      await queryClient.refetchQueries({ queryKey: ['user', 'me'], exact: true })
      navigate('/app/home')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('Código inválido ou expirado')
        return
      }
      toast.error('Não foi possível redefinir a senha')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
