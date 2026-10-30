import type { MacroIcon } from '@/shared/config/macros'

export type PlanProgressKey = 'calories' | 'protein' | 'carbs' | 'fat'

export type PlanProgressRow = {
  key: PlanProgressKey
  label: string
  icon: MacroIcon
  unit: string
  color: string
  trackColor: string
  target: number
  planned: number
  remaining: number
  over: boolean
  progress: number
}
