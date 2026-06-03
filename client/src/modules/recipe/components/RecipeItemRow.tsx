import { X } from '@phosphor-icons/react'
import type { FoodItem } from '../types/recipe'

type Props = {
  item: FoodItem
  isRemovePending: boolean
  onRemove: (item: FoodItem) => void
}

export default function RecipeItemRow({ item, isRemovePending, onRemove }: Props) {
  const name = (item.food ?? item.privateFood)?.name ?? 'Alimento'

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-150">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-bold text-neutral-950 dark:text-neutral-100 truncate">{name}</p>
          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">
            {Math.round(item.quantity)}g
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none text-rose-600">
              {Math.round(item.calories)}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mt-0.5">
              kcal
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item)}
            disabled={isRemovePending}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60"
            aria-label={`Remover ${name}`}
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 rounded-lg px-2 py-1.5 transition-colors duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span className="text-[11px] font-extrabold text-amber-900 tabular-nums">
            {Math.round(item.protein)}<span className="text-amber-700 font-bold">g</span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 ml-auto">Prot</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 rounded-lg px-2 py-1.5 transition-colors duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="text-[11px] font-extrabold text-blue-900 tabular-nums">
            {Math.round(item.carbs)}<span className="text-blue-700 font-bold">g</span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800 ml-auto">Carb</span>
        </div>
        <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 rounded-lg px-2 py-1.5 transition-colors duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
          <span className="text-[11px] font-extrabold text-violet-900 tabular-nums">
            {Math.round(item.fat)}<span className="text-violet-700 font-bold">g</span>
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-800 ml-auto">Gord</span>
        </div>
      </div>
    </div>
  )
}
