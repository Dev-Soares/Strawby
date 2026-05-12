import { motion } from 'framer-motion'
import { Fire } from '@phosphor-icons/react'
import type { DailySummary, MacroRing } from '../types/dailySummary'

function MacroBar({ label, value, max, unit, color, trackColor }: MacroRing) {
  const progress = Math.min(value / max, 1)
  const displayValue = unit === 'kcal' ? value.toLocaleString('pt-BR') : value

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-end justify-between mb-3">
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-neutral-950 tabular-nums leading-none">{displayValue}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase">{unit}</span>
        </div>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
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
      className="relative bg-white rounded-3xl shadow-sm p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Resumo diário</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Acompanhe seus macros</p>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 rounded-2xl px-4 py-2">
            <Fire size={16} weight="fill" className="text-red-500" />
            <span className="text-sm font-black text-red-600 tabular-nums">
              {calorias.value.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] font-bold text-red-400 uppercase">kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {data.macros.map((macro) => (
            <MacroBar key={macro.label} {...macro} />
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500">Progresso calórico do dia</span>
            <span className="text-xs font-bold text-neutral-700 tabular-nums">
              {calorias.value.toLocaleString('pt-BR')} / {calorias.max.toLocaleString('pt-BR')} kcal
            </span>
          </div>
          <div className="h-3 rounded-full bg-red-50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${calPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <p className="text-xs font-medium text-neutral-400 mt-2">{calPct}% da meta diária consumida</p>
        </div>
      </div>
    </motion.div>
  )
}
