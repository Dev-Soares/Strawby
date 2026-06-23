import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { googleSignInService } from '../service/googleSignInService'
import { GOOGLE_REDIRECT_URI } from '../config/google'

export const useGoogleCallback = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (code: string) => googleSignInService(code, GOOGLE_REDIRECT_URI),
    onSuccess: async () => {
      toast.success('Bem-vindo!')
      await queryClient.refetchQueries({ queryKey: ['user', 'me'], exact: true })
      navigate('/app/home', { replace: true })
    },
    onError: () => {
      toast.error('Erro ao entrar com Google. Tente novamente.')
      navigate('/app/login', { replace: true })
    },
  })
}
