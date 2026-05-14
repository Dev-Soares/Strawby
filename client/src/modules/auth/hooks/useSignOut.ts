import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signOutService } from '../service/signOutService'

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOutService,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })
      navigate('/login')
    },
    onError: () => {
      toast.error('Erro ao sair')
    },
  })
}
