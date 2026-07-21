import { motion } from 'framer-motion'
import type { MacroRing } from '../types/dailySummary'

export default function MacroBar({ label, value, max, unit, color, trackColor }: MacroRing) {
  const progress = max > 0 ? Math.min(value / max, 1) : 0
  const displayValue = unit === 'kcal' ? value.toLocaleString('pt-BR') : value

  return (
    <div className="flex flex-col min-w-0">
      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-1.5" style={{ color }}>
        {label}
      </span>
      <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none transition-colors duration-300">
          {displayValue}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase transition-colors duration-300">
          {unit}
        </span>
      </div>
      <div className="h-2 sm:h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
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
