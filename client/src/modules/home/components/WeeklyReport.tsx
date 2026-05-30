import { motion } from 'framer-motion'
import type { WeeklyReportData, WeekDayStatus } from '../types/weeklyReport'

const STATUS_STYLES: Record<WeekDayStatus, { dot: string; ring: string; score: string }> = {
  good:    { dot: 'bg-green-500',                      ring: 'ring-green-400/40',   score: 'text-green-600 dark:text-green-400' },
  warn:    { dot: 'bg-amber-400',                      ring: 'ring-amber-400/40',   score: 'text-amber-600 dark:text-amber-400' },
  bad:     { dot: 'bg-red-500',                        ring: 'ring-red-400/40',     score: 'text-red-600 dark:text-red-400' },
  neutral: { dot: 'bg-neutral-200 dark:bg-neutral-700', ring: 'ring-transparent',  score: 'text-neutral-400 dark:text-neutral-500' },
}

interface Props {
  data: WeeklyReportData
  todayIndex: number
  weekStartDate: Date
}

export default function WeeklyReport({ data, todayIndex }: Props) {
  const pct = data.weekMaxScore > 0 ? Math.round((data.weekScore / data.weekMaxScore) * 100) : 0

  return (
    <motion.div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-5 sm:p-6 transition-colors duration-300"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
            Relatório semanal
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
            {data.weekScore} / {data.weekMaxScore} pts
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl px-3 py-1.5 transition-colors duration-300">
          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">{pct}%</span>
          <span className="text-[10px] font-bold text-amber-400 dark:text-amber-500 uppercase">semana</span>
        </div>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-5">
        {data.days.map((day, i) => {
          const styles = STATUS_STYLES[day.status]
          const isToday = i === todayIndex

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${isToday ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
                {day.day}
              </span>

              <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ring-2 transition-all duration-300 ${styles.ring} ${isToday ? 'ring-red-400/50' : ''}`}>
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${styles.dot} flex items-center justify-center transition-colors duration-300`}>
                  {day.score !== undefined && (
                    <span className="text-[9px] font-extrabold text-white leading-none">{day.score}</span>
                  )}
                </div>
                {isToday && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                )}
              </div>

              <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 tabular-nums transition-colors duration-300">
                {day.date}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-colors duration-300">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        {(['good', 'warn', 'bad'] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[s].dot}`} />
            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 capitalize transition-colors duration-300">
              {s === 'good' ? 'Ótimo' : s === 'warn' ? 'Ok' : 'Fraco'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
