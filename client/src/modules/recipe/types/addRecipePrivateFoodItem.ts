import { z } from 'zod'

export const addRecipePrivateFoodItemSchema = z.object({
  privateFoodId: z.string().min(1, 'Alimento privado obrigatório'),
  quantity: z
    .number({ error: 'Informe a quantidade' })
    .min(0.1, 'Mínimo 0.1g')
    .max(2000, 'Máximo 2000g'),
})

export type AddRecipePrivateFoodItemData = z.infer<typeof addRecipePrivateFoodItemSchema>
