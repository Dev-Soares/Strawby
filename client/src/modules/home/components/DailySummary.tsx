import { motion } from 'framer-motion'
import { FireIcon } from '@phosphor-icons/react'
import type { DailySummary, MacroRing } from '../types/dailySummary'

function MacroBar({ label, value, max, unit, color, trackColor }: MacroRing) {
  const progress = Math.min(value / max, 1)
  const displayValue = unit === 'kcal' ? value.toLocaleString('pt-BR') : value

  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] sm:text-xs font-extrabold text-red-600 uppercase tracking-widest mb-1.5">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 tabular-nums leading-none">
          {displayValue}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase">
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

interface DailySummaryProps {
  data: DailySummary
}

export default function DailySummary({ data }: DailySummaryProps) {
  const calorias = data.macros[0]
  const calPct = Math.round((calorias.value / calorias.max) * 100)

  return (
    <motion.div
      className="relative bg-white rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Resumo diário</h2>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
              Acompanhe seus macros
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-red-50 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 shrink-0">
            <FireIcon size={14} weight="fill" className="text-red-500 sm:hidden" />
            <FireIcon size={16} weight="fill" className="text-red-500 hidden sm:block" />
            <span className="text-xs sm:text-sm font-extrabold text-red-600 tabular-nums">
              {calorias.value.toLocaleString('pt-BR')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-red-400 uppercase">
              kcal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-4">
          {data.macros.map((macro) => (
            <MacroBar key={macro.label} {...macro} />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate">
              Progresso calórico do dia
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-neutral-700 tabular-nums shrink-0">
              {calorias.value.toLocaleString('pt-BR')} / {calorias.max.toLocaleString('pt-BR')} kcal
            </span>
          </div>
          <div className="h-2.5 sm:h-3 rounded-full bg-red-50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${calPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-neutral-400 mt-2">
            {calPct}% da meta diária consumida
          </p>
        </div>
      </div>
    </motion.div>
  )
}
