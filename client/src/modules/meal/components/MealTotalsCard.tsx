import { Fire } from '@phosphor-icons/react'
import type { MealTotals } from '../types/meal'
import type { MealTypeConfig } from '../config/mealConfig'

type Props = {
  totals: MealTotals
  cfg: MealTypeConfig
}

const items = [
  { label: 'Calorias', key: 'calories' as const, unit: 'kcal', color: 'bg-red-500', track: 'bg-red-50 dark:bg-red-950/40' },
  { label: 'Proteína', key: 'protein' as const, unit: 'g', color: 'bg-amber-500', track: 'bg-amber-50 dark:bg-amber-950/40' },
  { label: 'Carboidrato', key: 'carbs' as const, unit: 'g', color: 'bg-blue-500', track: 'bg-blue-50 dark:bg-blue-950/40' },
  { label: 'Gordura', key: 'fat' as const, unit: 'g', color: 'bg-violet-500', track: 'bg-violet-50 dark:bg-violet-950/40' },
]

export default function MealTotalsCard({ totals, cfg }: Props) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 sm:p-6 mb-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-5">
        <Fire size={18} weight="fill" style={{ color: cfg.theme }} />
        <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: cfg.theme }}>
          Totais da refeição
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((t) => (
          <div key={t.label} className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
              {t.label}
            </span>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none">
                {Math.round(totals[t.key])}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase">{t.unit}</span>
            </div>
            <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden ${t.track} transition-colors duration-300`}>
              <div className={`h-full rounded-full ${t.color}`} style={{ width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
