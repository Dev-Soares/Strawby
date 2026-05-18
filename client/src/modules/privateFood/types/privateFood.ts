import { z } from 'zod'

export const privateFoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  servingSize: z.string().nullable(),
  createdAt: z.string(),
})

export type PrivateFood = z.infer<typeof privateFoodSchema>

export const createPrivateFoodSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(200, 'Máximo 200 caracteres'),
  calories: z.number().min(0, 'Mínimo 0'),
  protein: z.number().min(0, 'Mínimo 0'),
  carbs: z.number().min(0, 'Mínimo 0'),
  fat: z.number().min(0, 'Mínimo 0'),
  servingSize: z.string().max(50).optional(),
})

export type CreatePrivateFoodData = z.infer<typeof createPrivateFoodSchema>

export const updatePrivateFoodSchema = createPrivateFoodSchema.partial()

export type UpdatePrivateFoodData = z.infer<typeof updatePrivateFoodSchema>
