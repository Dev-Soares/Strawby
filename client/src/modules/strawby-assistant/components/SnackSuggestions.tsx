import { motion } from 'framer-motion'
import { Cookie, Flame, Ham, Wheat, Droplets } from 'lucide-react'
import { getMealType } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import type { SuggestedSnack, MealTotals } from '../types/snackSuggestion'

interface SnackSuggestionsProps {
  remaining: MealTotals | null
  options: SuggestedSnack[]
}

export default function SnackSuggestions({ remaining, options }: SnackSuggestionsProps) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  if (options.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Não consegui sugerir lanches no momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {remaining && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Macros restantes no dia</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <MacroBadge icon={Flame} value={Math.round(remaining.calories)} label="kcal" color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-950/40" />
            <MacroBadge icon={Ham} value={Math.round(remaining.protein)} label="g prot" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/40" />
            <MacroBadge icon={Wheat} value={Math.round(remaining.carbs)} label="g carb" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/40" />
            <MacroBadge icon={Droplets} value={Math.round(remaining.fat)} label="g gord" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/40" />
          </div>
        </div>
      )}

      {options.map((option, index) => {
        const config = getMealType(option.mealType)
        const accent = {
          surface: isDark ? `${config.accent}2e` : config.accentLight,
          ink: isDark ? config.accentLight : config.accentText,
          strong: isDark ? config.accentLight : config.accent,
        }

        return (
          <motion.div
            key={`${option.name}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: accent.surface }}
                >
                  <Cookie size={20} style={{ color: accent.strong }} />
                </span>
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-display text-lg font-extrabold leading-none tracking-tight"
                    style={{ color: accent.ink }}
                  >
                    {option.name}
                  </h4>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{option.reason}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                {option.items.map((item) => (
                  <li key={item.foodId} className="flex justify-between">
                    <span>{item.foodName}</span>
                    <span className="tabular-nums text-neutral-500 dark:text-neutral-500">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <MacroBadge icon={Flame} value={Math.round(option.totals.calories)} label="kcal" color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-950/40" />
                <MacroBadge icon={Ham} value={Math.round(option.totals.protein)} label="g prot" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/40" />
                <MacroBadge icon={Wheat} value={Math.round(option.totals.carbs)} label="g carb" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/40" />
                <MacroBadge icon={Droplets} value={Math.round(option.totals.fat)} label="g gord" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/40" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function MacroBadge({
  icon: Icon,
  value,
  label,
  color,
  bg,
}: {
  icon: typeof Flame
  value: number
  label: string
  color: string
  bg: string
}) {
  return (
    <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold tabular-nums ${bg} ${color}`}>
      <Icon size={12} />
      {value.toLocaleString('pt-BR')} {label}
    </span>
  )
}
