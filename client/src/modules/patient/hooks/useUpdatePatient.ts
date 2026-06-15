import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { updatePatientService, type UpdatePatientPayload } from '../service/updatePatientService'

export const useUpdatePatient = () => {
  const { data: user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePatientPayload) => updatePatientService(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['patient', user!.id] })
      toast.success('Dados atualizados!')
    },
    onError: () => {
      toast.error('Erro ao atualizar dados')
    },
  })
}
