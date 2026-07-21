import { Scales } from '@phosphor-icons/react'

interface CurrentWeightBadgeProps {
  latestWeight: number | null
  isPending: boolean
}

export default function CurrentWeightBadge({ latestWeight, isPending }: CurrentWeightBadgeProps) {
  return (
    <div className="flex-1 min-w-0 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
        <Scales size={22} weight="bold" className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-red-400 dark:text-red-500 uppercase tracking-widest mb-0.5">
          Peso atual
        </p>
        <div className="flex items-baseline gap-1 leading-none">
          {isPending ? (
            <div className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          ) : (
            <>
              <span className="font-display text-3xl font-extrabold text-red-600 dark:text-red-400">
                {latestWeight ?? '—'}
              </span>
              {latestWeight !== null && (
                <span className="text-sm font-bold text-red-400 dark:text-red-500">kg</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
