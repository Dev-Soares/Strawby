import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getPlanPdfService } from '../service/getPlanPdfService'

export const useDownloadPlanPdf = (patientId: string) => {
  return useMutation({
    mutationFn: () => getPlanPdfService(patientId),
    onSuccess: ({ blob, filename }) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    onError: () => {
      toast.error('Erro ao gerar PDF do plano')
    },
  })
}
