import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { verifyEmailSchema, type VerifyEmailData } from '../types/verifyEmail'
import { verifyEmailService } from '../service/verifyEmailService'
import { getMeService } from '../service/getMeService'

export const useVerifyEmail = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailData) => verifyEmailService(data.code),
    onSuccess: async () => {
      toast.success('E-mail verificado com sucesso!')
      // fetchQuery popula o cache mesmo se useAuth não estiver montado nesta
      // página pública — refetchQueries só refaz queries ativas e não redirecionava.
      await queryClient.fetchQuery({
        queryKey: ['user', 'me'],
        queryFn: getMeService,
        staleTime: 0,
      })
      navigate('/app/home')
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
