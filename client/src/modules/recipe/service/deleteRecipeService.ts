import { api } from '@/api/axios'

export const deleteRecipeService = async (patientId: string, id: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/recipe/${patientId}/${id}`)
  return data
}
