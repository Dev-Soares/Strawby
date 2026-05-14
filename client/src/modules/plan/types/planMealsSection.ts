import type { Icon } from '@phosphor-icons/react'
import type { MealSummary } from '../../meal/types/meal'

export interface MealTypeConfig {
  icon: Icon
  label: string
  accent: string
  accentLight: string
  accentText: string
}

export interface PlanMealCardProps {
  meal: MealSummary
  isOpen: boolean
  onToggle: () => void
}
