import { z } from 'zod'

export const addMealItemSchema = z.object({
  foodId: z.string().min(1, 'Alimento obrigatório'),
  quantity: z
    .number({ error: 'Informe a quantidade' })
    .min(0.1, 'Mínimo 0.1g')
    .max(2000, 'Máximo 2000g'),
})

export type AddMealItemData = z.infer<typeof addMealItemSchema>
