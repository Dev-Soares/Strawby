import { X } from '@phosphor-icons/react'
import type { RecipeInMeal } from '../types/meal'
import type { MealTypeConfig } from '@/shared/config/mealTypes'
import MacroChipsRow from './MacroChipsRow'

type Props = {
  recipe: RecipeInMeal
  cfg: MealTypeConfig
  onRemove: (recipe: RecipeInMeal) => void
  isRemovePending: boolean
}

export default function MealRecipeRow({ recipe, cfg, onRemove, isRemovePending }: Props) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-bold text-neutral-950 dark:text-neutral-100 truncate">
            {recipe.name}
          </p>
          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">Receita</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none" style={{ color: cfg.theme }}>
              {Math.round(recipe.calories)}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mt-0.5">
              kcal
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(recipe)}
            disabled={isRemovePending}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: cfg.theme, color: '#ffffff' }}
            aria-label={`Remover ${recipe.name}`}
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>
      <MacroChipsRow protein={recipe.protein} carbs={recipe.carbs} fat={recipe.fat} />
    </div>
  )
}
