import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { signUpSchema, type SignUpData } from '../types/signUp'
import { signUpService } from '../service/signUpService'

export const useSignUp = () => {
  const navigate = useNavigate()
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: SignUpData) => signUpService(data),
    onSuccess: (_, variables) => {
      navigate('/app/verify-email', { state: { email: variables.email } })
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
