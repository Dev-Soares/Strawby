import { Trash2 } from 'lucide-react'
import type { RecipeInMeal } from '../types/meal'
import type { MealTypeConfig } from '@/shared/config/mealTypes'
import { getMealAccent } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import MacroChipsRow from './MacroChipsRow'

type Props = {
  recipe: RecipeInMeal
  cfg: MealTypeConfig
  onRemove: (recipe: RecipeInMeal) => void
  isRemovePending: boolean
}

export default function MealRecipeRow({ recipe, cfg, onRemove, isRemovePending }: Props) {
  const { resolvedTheme } = useThemeContext()
  const accent = getMealAccent(cfg, resolvedTheme === 'dark')

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors duration-300 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-neutral-950 transition-colors duration-300 dark:text-neutral-100">
            {recipe.name}
          </p>
          <p className="mt-0.5 text-sm font-medium text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
            Receita
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-baseline gap-1">
            <span
              className="font-display text-xl font-extrabold leading-none tabular-nums"
              style={{ color: accent.ink }}
            >
              {Math.round(recipe.calories).toLocaleString('pt-BR')}
            </span>
            <span className="text-sm font-semibold" style={{ color: accent.ink }}>
              kcal
            </span>
          </span>

          <button
            type="button"
            onClick={() => onRemove(recipe)}
            disabled={isRemovePending}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-red-950/40"
            aria-label={`Remover ${recipe.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <MacroChipsRow protein={recipe.protein} carbs={recipe.carbs} fat={recipe.fat} />
    </div>
  )
}
