import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { signUpSchema, type SignUpData } from '../types/signUp'
import { signUpService } from '../service/signUpService'
import { signInService } from '../service/signInService'

export const useSignUp = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: SignUpData) => {
      const user = await signUpService(data)
      await signInService({ email: data.email, password: data.password })
      return user
    },
    onSuccess: (user) => {
      toast.success('Conta criada com sucesso!')
      queryClient.setQueryData(['auth', 'me'], user)
      navigate('/app/home')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('E-mail já cadastrado')
        return
      }
      toast.error('Não foi possível criar sua conta')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
