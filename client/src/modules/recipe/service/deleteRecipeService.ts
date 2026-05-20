import { api } from '@/api/axios'

export const deleteRecipeService = async (id: string): Promise<{ id: string }> => {
  const { data } = await api.delete(`/recipe/${id}`)
  return data
}
