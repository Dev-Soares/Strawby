import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { signInSchema, type SignInData } from '../types/signIn'
import { signInService } from '../service/signInService'

export const useSignIn = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  })

  const mutation = useMutation({
    mutationFn: signInService,
    onSuccess: async () => {
      toast.success('Bem-vindo de volta!')
      await queryClient.refetchQueries({ queryKey: ['auth', 'me'], exact: true })
      navigate('/home')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('E-mail ou senha inválidos')
        return
      }
      toast.error('Erro ao entrar. Tente novamente.')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
