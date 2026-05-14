import { motion } from 'framer-motion'
import { Trophy } from '@phosphor-icons/react'
import type { WeeklyScoreProps } from '../types/weeklyScore'

const RADIUS = 70
const STROKE = 14
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getScoreColor(pct: number) {
  if (pct >= 0.8) return '#10b981'
  if (pct >= 0.5) return '#f59e0b'
  return '#dc2626'
}

function getScoreLabel(pct: number) {
  if (pct >= 0.8) return 'Excelente'
  if (pct >= 0.6) return 'Bom'
  if (pct >= 0.4) return 'Regular'
  return 'Precisa melhorar'
}

export default function WeeklyScore({ score, maxScore }: WeeklyScoreProps) {
  const normalized = Math.round((score / maxScore) * 100)
  const pct = normalized / 100
  const color = getScoreColor(pct)
  const label = getScoreLabel(pct)
  const dashOffset = CIRCUMFERENCE * (1 - pct)

  return (
    <motion.div
      className="relative bg-white rounded-2xl sm:rounded-4xl overflow-hidden border border-neutral-200/70 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.18)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 }}
    >
      <div className="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6 bg-linear-to-br from-neutral-50 to-white border-b border-neutral-100">
        <div className="absolute left-0 top-5 bottom-4 sm:top-7 sm:bottom-6 w-1 bg-red-600 rounded-r-full" />
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-red-50 items-center justify-center shrink-0">
            <Trophy size={22} weight="duotone" className="text-red-600" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.22em] sm:tracking-[0.3em] text-neutral-400">
              Score da semana
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-none mt-1">
              Desempenho
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 sm:mt-1.5 font-medium">
              Sua consistência semanal
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 shrink-0">
          <svg
            viewBox={`0 0 ${(RADIUS + STROKE) * 2} ${(RADIUS + STROKE) * 2}`}
            className="w-full h-full -rotate-90"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle
              cx={RADIUS + STROKE}
              cy={RADIUS + STROKE}
              r={RADIUS}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={STROKE}
            />
            <motion.circle
              cx={RADIUS + STROKE}
              cy={RADIUS + STROKE}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[32px] sm:text-[52px] font-extrabold text-neutral-950 leading-none tabular-nums tracking-tight">
              {normalized}
            </span>
            <span className="text-[9px] sm:text-xs font-bold text-neutral-400 tracking-widest mt-1">
              / 100
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full flex flex-col items-center sm:items-start gap-3 sm:gap-4">
          <div
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {label}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">
                Pontos
              </span>
              <span className="font-display text-lg sm:text-2xl font-extrabold text-neutral-950 tabular-nums tracking-tight mt-0.5">
                {score}
                <span className="text-neutral-400 font-bold">/{maxScore}</span>
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">
                Aproveitamento
              </span>
              <span
                className="font-display text-lg sm:text-2xl font-extrabold tabular-nums tracking-tight mt-0.5"
                style={{ color }}
              >
                {normalized}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
