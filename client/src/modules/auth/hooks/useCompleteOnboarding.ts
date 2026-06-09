import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { onboardingSchema, type OnboardingData } from '../types/onboarding'
import { completeOnboardingService } from '../service/completeOnboardingService'
import { refreshTokenService } from '../service/refreshTokenService'

export const useCompleteOnboarding = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      await completeOnboardingService(data)
      await refreshTokenService()
    },
    onSuccess: async () => {
      sessionStorage.setItem('strawby_show_tutorial', '1')
      await queryClient.refetchQueries({ queryKey: ['user', 'me'], exact: true })
      navigate('/app/home')
    },
    onError: () => {
      toast.error('Erro ao salvar perfil. Tente novamente.')
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    ...form,
    onSubmit,
    isPending: mutation.isPending,
  }
}
