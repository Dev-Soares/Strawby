import type { Icon } from '@phosphor-icons/react'
import type { PlanMealSummary } from '../../plan-meal/types/planMeal'

export interface MealTypeConfig {
  icon: Icon
  label: string
  accent: string
  accentLight: string
  accentText: string
}

export interface PlanMealCardProps {
  meal: PlanMealSummary
  isOpen: boolean
  onToggle: () => void
}
