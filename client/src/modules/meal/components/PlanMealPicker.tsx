import { X } from '@phosphor-icons/react'
import { useGetPlanMeals } from '../hooks/useGetPlanMeals'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import type { Meal } from '../types/meal'
import { getMealType } from '@/shared/config/mealTypes'

type Props = {
  onSelect: (meal: Meal) => void
  onClose: () => void
}

export default function PlanMealPicker({ onSelect, onClose }: Props) {
  const { data: planMeals, isPending } = useGetPlanMeals()
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
          Refeições do plano
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
        >
          <X size={14} weight="bold" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2 max-h-96 overflow-y-auto">
        {isPending && (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        )}

        {!isPending && (!planMeals || planMeals.length === 0) && (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
              Nenhuma refeição planejada encontrada
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Adicione refeições ao seu plano primeiro
            </p>
          </div>
        )}

        {!isPending &&
          planMeals?.map((meal) => {
            const cfg = getMealType(meal.mealType)
            const Ico = cfg.icon
            const allItems = [
              ...meal.items.map((i) => ({ id: i.id, name: (i.food ?? i.privateFood)?.name ?? 'Alimento', detail: `${Math.round(i.quantity)}g` })),
              ...meal.recipes.map((r) => ({ id: r.id, name: r.name, detail: 'Receita' })),
            ]

            return (
              <button
                key={meal.id}
                type="button"
                onClick={() => onSelect(meal)}
                className="w-full flex flex-col gap-2.5 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer text-left"
              >
                {/* Header row */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isDark ? `${cfg.accent}26` : cfg.accentLight }}
                  >
                    <Ico size={16} weight="bold" style={{ color: isDark ? cfg.accentLight : cfg.accentText }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-tight">
                      {meal.name}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {Math.round(meal.totals.calories)} kcal · {allItems.length} {allItems.length === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>

                {/* Items list */}
                {allItems.length > 0 && (
                  <div className="flex flex-col gap-1 pl-12">
                    {allItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{item.name}</p>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {allItems.length === 0 && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 pl-12">Nenhum item</p>
                )}
              </button>
            )
          })}
      </div>
    </div>
  )
}
