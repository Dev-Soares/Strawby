import { api } from '@/api/axios'

export const disconnectNutritionistService = async (): Promise<void> => {
  await api.delete('/nutritionist/me')
}
