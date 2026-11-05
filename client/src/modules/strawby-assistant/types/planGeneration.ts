import { z } from 'zod'
import { ACTIVITY_LEVEL_VALUES } from '@/shared/config/activityLevels'

export const previewPlanSchema = z.object({
  movementLevel: z
    .number()
    .refine((value) => ACTIVITY_LEVEL_VALUES.includes(value), {
      message: 'Selecione o nível de atividade física',
    }),
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
