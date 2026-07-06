import { z } from 'zod'

export const mealObservationsSchema = z.object({
  observations: z.string().max(1000, 'Máximo de 1000 caracteres'),
})

export type MealObservationsData = z.infer<typeof mealObservationsSchema>
