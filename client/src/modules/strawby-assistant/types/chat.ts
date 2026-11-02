import { z } from 'zod'

export const sendAssistantMessageSchema = z.object({
  message: z.string().min(1, 'Digite uma mensagem').max(500, 'Mensagem muito longa'),
})

export type SendAssistantMessageData = z.infer<typeof sendAssistantMessageSchema>

export type AssistantMessageRole = 'user' | 'assistant'

export type MealTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type SuggestedMealItem = {
  id: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
  food: { id: string; name: string } | null
  privateFood: { id: string; name: string } | null
}

export type SuggestedMeal = {
  id: string
  name: string
  mealType: string
  time: string | null
  items: SuggestedMealItem[]
  totals: MealTotals
}

export type AssistantMessage = {
  id: string
  role: AssistantMessageRole
  content: string
  createdAt: string
  suggestedMeals?: SuggestedMeal[]
}

export type AssistantChat = {
  id: string
  messages: AssistantMessage[]
  createdAt: string
  updatedAt: string
}
