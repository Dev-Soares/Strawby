import { z } from 'zod'

export const mealItemSchema = z.object({
  foodName: z.string().min(1, 'Nome do alimento obrigatório'),
  quantity: z
    .number({ error: 'Informe a quantidade' })
    .min(1, 'Mínimo 1g')
    .max(2000, 'Máximo 2000g'),
})

export const createMealSchema = z.object({
  name: z.string().min(1, 'Nome da refeição obrigatório').max(100),
  mealType: z.enum(['breakfast', 'lunch', 'snack', 'dinner', 'supper'], {
    error: 'Selecione o tipo da refeição',
  }),
  time: z.string().min(1, 'Horário obrigatório'),
  items: z
    .array(mealItemSchema)
    .min(1, 'Adicione pelo menos um alimento'),
})

export type CreateMealData = z.infer<typeof createMealSchema>
export type MealItemData = z.infer<typeof mealItemSchema>
