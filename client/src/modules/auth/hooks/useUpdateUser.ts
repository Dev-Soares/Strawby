import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { useAuth } from './useAuth'
import { updateUserService, type UpdateUserPayload } from '../service/updateUserService'

export const useUpdateUser = () => {
  const { data: user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUserService(user!.id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['user', 'me'], updated)
      toast.success('Perfil atualizado!')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error('E-mail já cadastrado')
        return
      }
      toast.error('Erro ao atualizar perfil')
    },
  })
}
