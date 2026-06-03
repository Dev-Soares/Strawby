import {
  CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export type PatientMealType = {
  value: string
  label: string
  Icon: Icon
  color: string
}

export const PATIENT_MEAL_TYPES: PatientMealType[] = [
  { value: 'breakfast', label: 'Café da manhã', Icon: CoffeeIcon, color: '#ea580c' },
  { value: 'lunch', label: 'Almoço', Icon: ForkKnifeIcon, color: '#16a34a' },
  { value: 'snack', label: 'Lanche', Icon: LeafIcon, color: '#2563eb' },
  { value: 'dinner', label: 'Jantar', Icon: MoonIcon, color: '#9333ea' },
  { value: 'supper', label: 'Ceia', Icon: CookieIcon, color: '#475569' },
]

export const getPatientMealType = (mealType: string | null | undefined): PatientMealType =>
  PATIENT_MEAL_TYPES.find((m) => m.value === mealType) ?? PATIENT_MEAL_TYPES[0]

export type PlanMacro = {
  field: 'protein' | 'carbs' | 'fat'
  label: string
  color: string
  track: string
  unit: string
}

export const PLAN_MACROS: PlanMacro[] = [
  { field: 'protein', label: 'Proteína', color: '#f59e0b', track: '#fef3c7', unit: 'g' },
  { field: 'carbs', label: 'Carboidratos', color: '#3b82f6', track: '#dbeafe', unit: 'g' },
  { field: 'fat', label: 'Gordura', color: '#a855f7', track: '#f3e8ff', unit: 'g' },
]
