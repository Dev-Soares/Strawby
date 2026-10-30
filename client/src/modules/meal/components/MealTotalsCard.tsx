import { ChartPie } from 'lucide-react'
import type { MealTotals } from '../types/meal'
import type { MealTypeConfig } from '@/shared/config/mealTypes'
import { getMealAccent } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import { NUTRIENTS } from '@/shared/config/macros'

type Props = {
  totals: MealTotals
  cfg: MealTypeConfig
}

export default function MealTotalsCard({ totals, cfg }: Props) {
  const { resolvedTheme } = useThemeContext()
  const { surface, ink } = getMealAccent(cfg, resolvedTheme === 'dark')

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: surface }}
        >
          <ChartPie size={18} style={{ color: ink }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color: ink }}>
          Totais da refeição
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {NUTRIENTS.map((nutrient) => {
          // CSS vars no lugar do hex do config: o hex é sempre o tom claro.
          const color = `var(--macro-${nutrient.field})`
          const track = `var(--macro-${nutrient.field}-light)`
          const NutrientIcon = nutrient.icon
          return (
            <div
              key={nutrient.field}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-3 flex min-w-0 items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: track }}
                >
                  <NutrientIcon size={15} style={{ color }} />
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
                  {nutrient.label}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span
                  className="font-display text-xl font-extrabold leading-none tabular-nums xl:text-2xl"
                  style={{ color }}
                >
                  {Math.round(totals[nutrient.field]).toLocaleString('pt-BR')}
                </span>
                <span className="text-sm font-semibold" style={{ color }}>
                  {nutrient.unit}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
