import { useMutation } from '@tanstack/react-query'
import { verifyEmailService } from '../service/verifyEmailService'

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmailService(token),
  })
}
