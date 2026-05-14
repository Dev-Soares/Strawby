import type { PlanData } from './plan'

export interface MacroCard {
  label: string
  field: keyof Pick<PlanData, 'protein' | 'carbs' | 'fat'>
  color: string
  trackColor: string
  max: number
}

export interface PlanFormProps {
  defaultValues: PlanData
}
