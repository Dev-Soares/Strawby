import { z } from 'zod'

export const previewPlanSchema = z.object({
  movementLevel: z.number().min(1.15).max(1.6),
})

export type PreviewPlanData = z.infer<typeof previewPlanSchema>

/** Plano calculado pela API, ainda não gravado. */
export type PlanDraft = {
  calories: number
  protein: number
  carbs: number
  fat: number
  /** Já existe plano: confirmar substitui o atual. */
  replacesExisting: boolean
}

export type ConfirmPlanData = {
  calories: number
  protein: number
  carbs: number
  fat: number
}
