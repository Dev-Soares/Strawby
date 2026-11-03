import { Plus } from 'lucide-react'
import { getMealAccent, getMealType } from '@/shared/config/mealTypes'
import { CALORIES, MACROS } from '@/shared/config/macros'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import type { SuggestedSnack } from '../types/snackSuggestion'

interface SnackSuggestionCardProps {
  option: SuggestedSnack
  onAdd?: () => void
  isAdding?: boolean
}

export default function SnackSuggestionCard({
  option,
  onAdd,
  isAdding,
}: SnackSuggestionCardProps) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const config = getMealType(option.mealType)
  const MealIcon = config.icon
  const CaloriesIcon = CALORIES.icon
  const { surface, ink, strong } = getMealAccent(config, isDark)

  // Mesma prévia do MealCard fechado: alimentos por extenso em uma linha só.
  const contents = option.items.map((item) => item.foodName).join(', ')

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
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
            {option.name}
          </h3>
        </div>

        <p
          className="mt-2 ml-2 line-clamp-2 text-base font-medium leading-snug text-pretty transition-colors duration-300"
          style={{ color: ink }}
        >
          {contents}
        </p>

        <p
          className="mt-1.5 ml-2 line-clamp-2 text-sm leading-snug opacity-70 transition-colors duration-300"
          style={{ color: ink }}
        >
          {option.reason}
        </p>

        <div className="mt-3.5 flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
            style={{ backgroundColor: surface, color: ink }}
          >
            <CaloriesIcon size={18} style={{ color: strong }} />
            {Math.round(option.totals.calories).toLocaleString('pt-BR')} kcal
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
                {Math.round(option.totals[macro.field])}g {macro.label}
              </span>
            )
          })}
        </div>
      </div>

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={isAdding}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-neutral-100 py-3 text-sm font-bold transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
          style={{ color: ink }}
        >
          <Plus size={16} />
          {isAdding ? 'Adicionando...' : 'Adicionar ao diário'}
        </button>
      )}
    </div>
  )
}
