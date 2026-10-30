import type { MacroIcon } from '@/shared/config/macros'

export interface MacroRing {
  label: string
  icon: MacroIcon
  value: number
  max: number
  unit: string
  color: string
  trackColor: string
}

export interface DailySummary {
  macros: MacroRing[]
}
