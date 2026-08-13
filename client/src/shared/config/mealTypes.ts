import {
  CoffeeIcon,
  ForkKnifeIcon,
  LeafIcon,
  MoonIcon,
  CookieIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'

export type MealTypeConfig = {
  value: string
  icon: Icon
  /** Nome completo — "Café da manhã" */
  name: string
  /** Rótulo curto em caixa alta — "MANHÃ" */
  label: string
  /** Cor principal em hex */
  accent: string
  accentLight: string
  accentText: string
  accentClass: string
  bg: string
  text: string
  divider: string
  themeBg: string
  /** @deprecated alias de `accent` */
  color: string
  /** @deprecated alias de `accent` */
  theme: string
  /** @deprecated alias de `accentLight` */
  themeLight: string
  /** @deprecated alias de `icon` */
  Icon: Icon
}

/** Preenche os aliases legados a partir dos campos canônicos */
const withAliases = (
  c: Omit<MealTypeConfig, 'color' | 'theme' | 'themeLight' | 'Icon'>,
): MealTypeConfig => ({
  ...c,
  color: c.accent,
  theme: c.accent,
  themeLight: c.accentLight,
  Icon: c.icon,
})

export const MEAL_TYPES: Record<string, MealTypeConfig> = {
  breakfast: withAliases({
    value: 'breakfast', icon: CoffeeIcon, name: 'Café da manhã', label: 'MANHÃ',
    accent: '#ea580c', accentLight: '#fed7aa', accentText: '#c2410c',
    accentClass: 'text-orange-600', bg: 'bg-orange-50', text: 'text-orange-700',
    divider: 'border-orange-100', themeBg: '#fff7ed',
  }),
  lunch: withAliases({
    value: 'lunch', icon: ForkKnifeIcon, name: 'Almoço', label: 'ALMOÇO',
    accent: '#16a34a', accentLight: '#bbf7d0', accentText: '#15803d',
    accentClass: 'text-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700',
    divider: 'border-emerald-100', themeBg: '#f0fdf4',
  }),
  snack: withAliases({
    value: 'snack', icon: LeafIcon, name: 'Lanche', label: 'LANCHE',
    accent: '#2563eb', accentLight: '#bfdbfe', accentText: '#1d4ed8',
    accentClass: 'text-blue-600', bg: 'bg-blue-50', text: 'text-blue-700',
    divider: 'border-blue-100', themeBg: '#eff6ff',
  }),
  dinner: withAliases({
    value: 'dinner', icon: MoonIcon, name: 'Jantar', label: 'JANTAR',
    accent: '#9333ea', accentLight: '#e9d5ff', accentText: '#7e22ce',
    accentClass: 'text-violet-600', bg: 'bg-violet-50', text: 'text-violet-700',
    divider: 'border-violet-100', themeBg: '#faf5ff',
  }),
  supper: withAliases({
    value: 'supper', icon: CookieIcon, name: 'Ceia', label: 'CEIA',
    accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155',
    accentClass: 'text-slate-600', bg: 'bg-slate-100', text: 'text-slate-700',
    divider: 'border-slate-100', themeBg: '#f8fafc',
  }),
}

export const FALLBACK_MEAL_TYPE: MealTypeConfig = withAliases({
  value: '', icon: CoffeeIcon, name: 'Refeição', label: 'REFEIÇÃO',
  accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155',
  accentClass: 'text-neutral-600', bg: 'bg-neutral-50', text: 'text-neutral-700',
  divider: 'border-neutral-100', themeBg: '#f8fafc',
})

export const MEAL_TYPE_LIST: MealTypeConfig[] = Object.values(MEAL_TYPES)

export const getMealType = (mealType: string | null | undefined): MealTypeConfig =>
  MEAL_TYPES[mealType ?? ''] ?? FALLBACK_MEAL_TYPE
