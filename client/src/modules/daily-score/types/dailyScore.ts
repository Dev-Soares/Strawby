import { z } from 'zod'

export const dailyScoreSchema = z.object({
  id: z.string(),
  date: z.string().datetime(),
  score: z.number(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type DailyScore = z.infer<typeof dailyScoreSchema>
