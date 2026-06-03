import {
  CoffeeIcon,
  ForkKnifeIcon,
  LeafIcon,
  MoonIcon,
  CookieIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export type MealTypeConfig = {
  icon: Icon
  label: string
  accent: string
  bg: string
  text: string
  divider: string
  theme: string
  themeLight: string
  themeBg: string
}

export const mealConfig: Record<string, MealTypeConfig> = {
  breakfast: {
    icon: CoffeeIcon, label: 'Café da manhã',
    accent: 'text-orange-600', bg: 'bg-orange-50', text: 'text-orange-700', divider: 'border-orange-100',
    theme: '#ea580c', themeLight: '#fed7aa', themeBg: '#fff7ed',
  },
  lunch: {
    icon: ForkKnifeIcon, label: 'Almoço',
    accent: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700', divider: 'border-emerald-100',
    theme: '#16a34a', themeLight: '#bbf7d0', themeBg: '#f0fdf4',
  },
  snack: {
    icon: LeafIcon, label: 'Lanche',
    accent: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', divider: 'border-blue-100',
    theme: '#2563eb', themeLight: '#bfdbfe', themeBg: '#eff6ff',
  },
  dinner: {
    icon: MoonIcon, label: 'Jantar',
    accent: 'text-violet-600', bg: 'bg-violet-50', text: 'text-violet-700', divider: 'border-violet-100',
    theme: '#9333ea', themeLight: '#e9d5ff', themeBg: '#faf5ff',
  },
  supper: {
    icon: CookieIcon, label: 'Ceia',
    accent: 'text-slate-600', bg: 'bg-slate-100', text: 'text-slate-700', divider: 'border-slate-100',
    theme: '#475569', themeLight: '#cbd5e1', themeBg: '#f8fafc',
  },
}

export const fallbackMealConfig: MealTypeConfig = {
  icon: CoffeeIcon, label: 'Refeição',
  accent: 'text-neutral-600', bg: 'bg-neutral-50', text: 'text-neutral-700', divider: 'border-neutral-100',
  theme: '#475569', themeLight: '#e2e8f0', themeBg: '#f8fafc',
}

export const getMealConfig = (mealType: string | null | undefined): MealTypeConfig =>
  mealConfig[mealType ?? ''] || fallbackMealConfig
