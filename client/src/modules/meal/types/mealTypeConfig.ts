export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'

import type { Icon } from '@phosphor-icons/react'

export type MealTypeConfig = {
  icon: Icon
  label: string
  name: string
  accent: string
  accentLight: string
  accentText: string
}
