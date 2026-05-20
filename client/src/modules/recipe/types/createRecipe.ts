import { z } from 'zod'

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(200, 'Máximo de 200 caracteres'),
})

export type CreateRecipeData = z.infer<typeof createRecipeSchema>
