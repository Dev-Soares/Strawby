import { api } from '@/api/axios'

type PdfResponse = {
  filename: string
  contentType: string
  data: { type: string; data: number[] }
}

export const getPlanPdfService = async (patientId: string): Promise<{ blob: Blob; filename: string }> => {
  const { data } = await api.get<PdfResponse>(`/plan/${patientId}/pdf`)
  const bytes = new Uint8Array(data.data.data)
  const blob = new Blob([bytes], { type: 'application/pdf' })
  return { blob, filename: data.filename }
}
