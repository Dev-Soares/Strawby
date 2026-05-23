import { motion } from 'framer-motion'
import { ChartBar } from '@phosphor-icons/react'
import { useGetAverageScore } from '../hooks/useGetAverageScore'
import TotalScoreCardSkeleton from '../skeletons/TotalScoreCardSkeleton'

function getScoreLabel(score: number) {
  if (score >= 8) return 'Excelente'
  if (score >= 5) return 'Bom'
  if (score >= 3) return 'Regular'
  return 'Precisa melhorar'
}

function getScoreColor(score: number) {
  if (score >= 8) return '#10b981'
  if (score >= 5) return '#f59e0b'
  return '#dc2626'
}

export default function TotalScoreCard() {
  const { data, isPending, isError } = useGetAverageScore()

  if (isPending) return <TotalScoreCardSkeleton />
  if (isError || !data || data.score == null) return null

  const score = Math.round(data.score * 10) / 10
  const label = getScoreLabel(score)
  const color = getScoreColor(score)
  const pct = Math.min((score / 10) * 100, 100)

  return (
    <motion.div
      className="relative bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-4xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.18)] transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
    >
      <div className="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-900 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="absolute left-0 top-5 bottom-4 sm:top-7 sm:bottom-6 w-1 bg-red-600 rounded-r-full" />
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 items-center justify-center shrink-0 transition-colors duration-300">
            <ChartBar size={22} weight="duotone" className="text-red-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.22em] sm:tracking-[0.3em] text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              Geral
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
              Score total
            </h2>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
        <div className="flex flex-col items-center sm:items-start min-w-0">
          <span className="font-display text-[40px] sm:text-[56px] font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums tracking-tight transition-colors duration-300">
            {score}
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest mt-1 transition-colors duration-300">
            / 10
          </span>
        </div>

        <div className="flex-1 min-w-0 w-full flex flex-col items-center sm:items-start gap-3 sm:gap-4">
          <div
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label}
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-colors duration-300">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium transition-colors duration-300">
            Pontuação média geral da sua conta
          </p>
        </div>
      </div>
    </motion.div>
  )
}
