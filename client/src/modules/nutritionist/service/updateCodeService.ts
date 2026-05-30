import { api } from '@/api/axios'
import type { UpdateCodeData } from '../types/updateCode'
import type { Nutritionist } from '../types/nutritionist'

export const updateCodeService = async (dto: UpdateCodeData): Promise<Nutritionist> => {
  const { data } = await api.post<Nutritionist>('/nutritionist/me/code', dto)
  return data
}
