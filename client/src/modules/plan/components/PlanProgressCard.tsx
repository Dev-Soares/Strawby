import { Target, Check } from '@phosphor-icons/react'
import { usePlanProgress } from '../hooks/usePlanProgress'
import PlanProgressCardSkeleton from '../skeletons/PlanProgressCardSkeleton'

const round = (n: number) => Math.round(n).toLocaleString('pt-BR')

export default function PlanProgressCard() {
  const { rows, hasPlan, isPending, isError } = usePlanProgress()

  if (isPending) return <PlanProgressCardSkeleton />
  if (isError || !hasPlan) return null

  const overall = rows.length ? Math.round((rows.reduce((a, r) => a + r.progress, 0) / rows.length) * 100) : 0

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-7 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <Target size={18} weight="fill" className="text-red-500" />
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight transition-colors duration-300">
              Para fechar o planejado
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 transition-colors duration-300">
              Falta nas refeições planejadas para bater a meta
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-display text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums transition-colors duration-300">
            {overall}%
          </span>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {rows.map((row) => {
          const done = !row.over && row.remaining === 0
          return (
            <div
              key={row.key}
              className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/30 p-4 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide transition-colors duration-300">
                    {row.label}
                  </span>
                </div>
                {done && (
                  <Check size={14} weight="bold" className="text-green-600 dark:text-green-500" />
                )}
              </div>

              {/* Highlight: remaining */}
              <div className="mb-3">
                {row.over ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-amber-600 dark:text-amber-500 tabular-nums leading-none">
                        +{round(row.planned - row.target)}
                      </span>
                      <span className="text-sm font-semibold text-amber-600/70 dark:text-amber-500/70">{row.unit}</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mt-1 transition-colors duration-300">acima da meta</p>
                  </>
                ) : done ? (
                  <>
                    <div className="font-display text-3xl font-extrabold text-green-600 dark:text-green-500 tabular-nums leading-none">
                      {round(row.target)}
                      <span className="text-sm font-semibold text-green-600/70 dark:text-green-500/70"> {row.unit}</span>
                    </div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-500 mt-1 transition-colors duration-300">completo</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none transition-colors duration-300">
                        {round(row.remaining)}
                      </span>
                      <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">{row.unit}</span>
                    </div>
                    <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mt-1 transition-colors duration-300">faltando</p>
                  </>
                )}
              </div>

              {/* Progress */}
              <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: row.trackColor }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${row.progress * 100}%`, backgroundColor: row.color }}
                />
              </div>
              <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 tabular-nums transition-colors duration-300">
                {round(row.planned)} / {round(row.target)} {row.unit}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
