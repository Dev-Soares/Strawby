import { z } from 'zod'

export const sendAssistantMessageSchema = z.object({
  message: z.string().min(1, 'Digite uma mensagem').max(2000, 'Mensagem muito longa'),
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
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
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
