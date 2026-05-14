import type { Icon } from '@phosphor-icons/react'

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'

export interface MealTypeConfig {
  icon: Icon
  label: string
  name: string
  accent: string
  accentLight: string
  accentText: string
}
