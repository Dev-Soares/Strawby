import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { getMealAccent, getMealType } from '@/shared/config/mealTypes'
import { CALORIES, MACROS } from '@/shared/config/macros'
import type { SuggestedMeal } from '../types/chat'

interface SuggestedMealCardsProps {
  meals: SuggestedMeal[]
}

export default function SuggestedMealCards({ meals }: SuggestedMealCardsProps) {
  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <SuggestedMealCard key={meal.id} meal={meal} index={index} />
      ))}
    </div>
  )
}

function SuggestedMealCard({ meal, index }: { meal: SuggestedMeal; index: number }) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const config = getMealType(meal.mealType)
  const MealIcon = config.icon
  const CaloriesIcon = CALORIES.icon
  const { surface, ink, strong } = getMealAccent(config, isDark)
  const totalKcal = Math.round(meal.totals.calories)

  const contents = meal.items.map((item) => (item.food ?? item.privateFood)?.name ?? 'Alimento')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: surface }}
          >
            <MealIcon size={23} style={{ color: ink }} />
          </span>

          <h3
            className="min-w-0 flex-1 truncate font-display text-lg font-extrabold leading-none tracking-tight sm:text-xl"
            style={{ color: ink }}
          >
            {meal.name}
          </h3>

          {meal.time && (
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: surface }}
            >
              <Clock size={16} style={{ color: strong }} />
              <span
                className="text-sm font-extrabold leading-none tabular-nums"
                style={{ color: ink }}
              >
                {meal.time}
              </span>
            </span>
          )}
        </div>

        <p
          className="mt-3 ml-2 min-h-11 line-clamp-2 pr-10 text-base font-medium leading-snug text-pretty transition-colors duration-300 sm:pr-16"
          style={{ color: ink }}
        >
          {contents.length > 0 ? contents.join(', ') : 'Nenhum alimento registrado'}
        </p>

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
            style={{ backgroundColor: surface, color: ink }}
          >
            <CaloriesIcon size={18} style={{ color: strong }} />
            {totalKcal.toLocaleString('pt-BR')} kcal
          </span>

          {MACROS.map((macro) => {
            const MacroIcon = macro.icon
            return (
              <span
                key={macro.field}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
                style={{ backgroundColor: surface, color: ink }}
              >
                <MacroIcon size={18} style={{ color: strong }} />
                {Math.round(meal.totals[macro.field])}g {macro.label}
              </span>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
