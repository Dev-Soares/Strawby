import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deleteUserService } from '../service/deleteUserService'
import { signOutService } from '../service/signOutService'

export const useDeleteUser = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteUserService(id)
      await signOutService()
    },
    onSuccess: () => {
      queryClient.clear()
      navigate('/')
    },
    onError: () => {
      toast.error('Erro ao deletar conta')
    },
  })
}
