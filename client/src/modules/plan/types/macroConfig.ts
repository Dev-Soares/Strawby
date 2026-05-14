import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { PlanData } from './plan'

export interface MacroRow {
  label: string
  fieldName: keyof Pick<PlanData, 'protein' | 'carbs' | 'fat'>
  color: string
  trackColor: string
  max: number
}

export interface MacroConfigProps {
  register: UseFormRegister<PlanData>
  errors: FieldErrors<PlanData>
  watchValues: { protein: number; carbs: number; fat: number }
}
