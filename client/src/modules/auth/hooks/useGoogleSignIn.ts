import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { CredentialResponse } from '@react-oauth/google'
import { googleSignInService } from '../service/googleSignInService'

export const useGoogleSignIn = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) throw new Error('No credential')
      return googleSignInService(credentialResponse.credential)
    },
    onSuccess: async () => {
      toast.success('Bem-vindo!')
      await queryClient.refetchQueries({ queryKey: ['user', 'me'], exact: true })
      navigate('/app/home')
    },
    onError: () => {
      toast.error('Erro ao entrar com Google. Tente novamente.')
    },
  })

  return {
    onSuccess: (credentialResponse: CredentialResponse) => mutation.mutate(credentialResponse),
    onError: () => toast.error('Erro ao autenticar com Google.'),
    isPending: mutation.isPending,
  }
}
