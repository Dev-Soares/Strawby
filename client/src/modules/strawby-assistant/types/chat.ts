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

/**
 * Define a reação do mascote.
 * `prompt` é local: o Strawby fez uma pergunta e está esperando o usuário.
 * `preview` é a refeição montada aguardando confirmação — nada foi salvo ainda.
 * `unavailable` é local: a IA está fora do ar e o mascote avisa no lugar do erro.
 * Os demais são o desfecho da tentativa de registrar a refeição.
 */
export type AssistantMessageStatus =
  | 'prompt'
  | 'preview'
  | 'created'
  | 'not_found'
  | 'not_understood'
  | 'unavailable'

export type MealDraftItem = {
  foodId: string
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

/** Refeição montada pela IA, ainda não gravada. */
export type MealDraft = {
  name: string
  mealType: string | null
  time: string | null
  observations: string | null
  items: MealDraftItem[]
  totals: MealTotals
}

export type ConfirmMealData = {
  mealType?: string
  time?: string
  observations?: string
  items: { foodId: string; quantity: number }[]
}

export type AssistantMessage = {
  id: string
  role: AssistantMessageRole
  content: string
  createdAt: string
  status?: AssistantMessageStatus
  /** Presente só quando `status === 'preview'`. */
  draft?: MealDraft
  suggestedMeals?: SuggestedMeal[]
}

export type AssistantChat = {
  id: string
  messages: AssistantMessage[]
  createdAt: string
  updatedAt: string
}
