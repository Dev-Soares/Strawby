import { motion } from 'framer-motion'
import { FireIcon } from '@phosphor-icons/react'
import type { DailySummary } from '../types/dailySummary'
import MacroBar from './MacroBar'

interface DailySummaryProps {
  data: DailySummary
}

export default function DailySummary({ data }: DailySummaryProps) {
  const calorias = data.macros[0]
  const calPct = calorias.max > 0 ? Math.round((calorias.value / calorias.max) * 100) : 0

  return (
    <motion.div
      className="relative @container bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-8 overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-red-50 dark:bg-red-950/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none transition-colors duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">Resumo diário</h2>
            <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
              Acompanhe seus macros
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-red-50 dark:bg-red-950/40 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 shrink-0 transition-colors duration-300">
            <FireIcon size={14} weight="fill" className="text-red-500 sm:hidden" />
            <FireIcon size={16} weight="fill" className="text-red-500 hidden sm:block" />
            <span className="text-xs sm:text-sm font-extrabold text-red-600 tabular-nums">
              {calorias.value.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase">
              kcal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {data.macros.map((macro) => (
            <MacroBar key={macro.label} {...macro} />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <span className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 truncate transition-colors duration-300">
              Progresso calórico do dia
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 tabular-nums shrink-0 transition-colors duration-300">
              {calorias.value.toLocaleString('pt-BR')} / {calorias.max.toLocaleString('pt-BR')} kcal
            </span>
          </div>
          <div className="h-2.5 sm:h-3 rounded-full bg-red-50 dark:bg-red-950/40 overflow-hidden transition-colors duration-300">
            <motion.div
              className="h-full rounded-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${calPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <p className="text-xs sm:text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-2 transition-colors duration-300">
            {calPct}% da meta diária consumida
          </p>
        </div>
      </div>
    </motion.div>
  )
}
