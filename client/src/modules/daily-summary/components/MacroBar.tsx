import { motion } from 'framer-motion'
import type { MacroRing } from '../types/dailySummary'

export default function MacroBar({ label, icon: Icon, value, max, unit, color, trackColor }: MacroRing) {
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const displayValue = unit === 'kcal' ? value.toLocaleString('pt-BR') : value
  const displayMax = unit === 'kcal' ? max.toLocaleString('pt-BR') : max

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: trackColor }}
        >
          <Icon size={16} style={{ color }} />
        </span>
        <span className="min-w-0 truncate text-base font-bold tracking-tight sm:text-lg" style={{ color }}>
          {label}
        </span>
        {max > 0 && (
          <span className="ml-auto shrink-0 text-xs font-bold tabular-nums" style={{ color }}>
            {Math.round(progress * 100)}%
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-extrabold leading-none tabular-nums text-neutral-950 transition-colors duration-300 dark:text-neutral-100 sm:text-3xl">
          {displayValue}
        </span>
        {max > 0 && (
          <span className="text-sm font-bold leading-none tabular-nums text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
            /{displayMax}
          </span>
        )}
        <span className="text-xs font-semibold leading-none text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
          {unit}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: trackColor }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
