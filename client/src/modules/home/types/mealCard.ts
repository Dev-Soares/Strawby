import type { Icon } from '@phosphor-icons/react'
import type { Meal } from '../../meal/types/meal'

export interface MealConfig {
  icon: Icon
  label: string
  bg: string
  text: string
  accent: string
  divider: string
}

export interface MealCardProps {
  meal: Meal
  isOpen: boolean
  onToggle: () => void
}
