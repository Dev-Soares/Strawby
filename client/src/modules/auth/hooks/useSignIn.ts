import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { signInSchema, type SignInData } from '../types/signIn'
import { signInService } from '../service/signInService'
import { getMeService } from '../service/getMeService'

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
      // popula o cache antes de navegar para evitar o ProtectedRoute
      // piscar (skeleton → login → home) com dado velho/ausente
      await queryClient.fetchQuery({
        queryKey: ['user', 'me'],
        queryFn: getMeService,
        staleTime: 0,
      })
      navigate('/app/home')
    },
    onError: (error, variables) => {
      if (isAxiosError(error) && error.response?.status === 403) {
        navigate('/app/verify-email', { state: { email: variables.email } })
        return
      }
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
