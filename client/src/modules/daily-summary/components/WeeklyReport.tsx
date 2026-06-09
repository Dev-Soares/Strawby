import { motion } from 'framer-motion'
import { CheckIcon, XIcon, CalendarBlankIcon, WarningIcon } from '@phosphor-icons/react'
import type { WeeklyReportData, WeekDay, WeekDayStatus } from '../types/weeklyReport'

interface WeeklyReportProps {
  data: WeeklyReportData
  todayIndex: number
  weekStartDate: Date
}

const fullDayNames = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']
const shortDayNames = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function StatusMark({ status }: { status: WeekDayStatus }) {
  if (status === 'good') {
    return (
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-emerald-500">
        <CheckIcon size={12} weight="bold" className="text-white" />
      </div>
    )
  }
  if (status === 'warn') {
    return (
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 bg-amber-500">
        <WarningIcon size={12} weight="bold" className="text-white" />
      </div>
    )
  }
  if (status === 'bad') {
    return (
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0">
        <XIcon size={12} weight="bold" className="text-white" />
      </div>
    )
  }
  return <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 shrink-0 transition-colors duration-300" />
}

function DayCell({ day, idx, isToday }: { day: WeekDay; idx: number; isToday: boolean }) {
  const dimmed = day.status === 'neutral' && !isToday

  return (
    <motion.div
      className="relative min-w-0"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <div
        className={`relative flex flex-col rounded-2xl overflow-hidden aspect-4/5 sm:aspect-5/7 transition-colors ${
          isToday
            ? 'bg-red-600 shadow-[0_10px_24px_-10px_rgba(220,38,38,0.5)]'
            : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}
      >
        {/* Header dia da semana */}
        <div
          className={`text-center pt-2 sm:pt-2.5 pb-1 sm:pb-1.5 text-[9px] sm:text-[9px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] ${
            isToday
              ? 'text-white/70'
              : dimmed
                ? 'text-neutral-300 dark:text-neutral-600'
                : 'text-neutral-400 dark:text-neutral-500'
          } transition-colors duration-300`}
        >
          <span className="hidden sm:inline">{fullDayNames[idx]}</span>
          <span className="sm:hidden">{shortDayNames[idx]}</span>
        </div>

        {/* Data */}
        <div className="flex-1 flex flex-col items-center justify-center px-1">
          <span
            className={`font-display text-[26px] sm:text-[30px] md:text-[34px] font-extrabold tabular-nums leading-none tracking-tight ${
              isToday
                ? 'text-white'
                : dimmed
                  ? 'text-neutral-300 dark:text-neutral-600'
                  : 'text-neutral-900 dark:text-neutral-100'
            } transition-colors duration-300`}
          >
            {day.date}
          </span>
        </div>

        {/* Footer: score */}
        <div className="flex items-center justify-center pb-2.5 sm:pb-3 pt-1 min-h-6.5 sm:min-h-7">
          {day.score !== undefined ? (
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                isToday
                  ? 'bg-white/20'
                  : day.status === 'good'
                    ? 'bg-emerald-500'
                    : day.status === 'warn'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
              } transition-colors duration-300`}
            >
              <span className="text-[11px] sm:text-xs font-extrabold text-white tabular-nums leading-none">
                {day.score}
              </span>
            </div>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function WeeklyReport({ data, todayIndex, weekStartDate }: WeeklyReportProps) {
  const monthLabel = weekStartDate
    .toLocaleDateString('pt-BR', { month: 'long' })
    .toUpperCase()
  const displayMonth = monthLabel.charAt(0) + monthLabel.slice(1).toLowerCase()
  const yearLabel = weekStartDate.getFullYear()
  const weekNumber = Math.ceil(weekStartDate.getDate() / 7)

  return (
    <motion.div
      className="relative bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-4xl overflow-hidden border border-neutral-200/70 dark:border-neutral-800/70 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.18)] transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
    >
      {/* Header */}
      <div className="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6 bg-linear-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-900 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
        <div className="absolute left-0 top-5 bottom-4 sm:top-7 sm:bottom-6 w-1 bg-red-600 rounded-r-full" />

        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 items-center justify-center shrink-0 transition-colors duration-300">
              <CalendarBlankIcon size={22} weight="duotone" className="text-red-600" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none truncate transition-colors duration-300">
                {displayMonth}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 sm:mt-1.5 font-medium transition-colors duration-300">
                Sua semana em registro
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de dias */}
      <div className="px-3 sm:px-6 py-4 sm:py-6 bg-white dark:bg-neutral-900 transition-colors duration-300">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5">
          {data.days.map((day, idx) => (
            <DayCell
              key={day.day + day.date}
              day={day}
              idx={idx}
              isToday={idx === todayIndex}
            />
          ))}
        </div>
      </div>

      {/* Rodapé: legenda */}
      <div className="px-4 sm:px-8 pb-5 sm:pb-6 pt-1 sm:pt-2 flex items-center justify-end gap-3 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
            Meta
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
            Atenção
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
            Excedeu
          </span>
        </div>
      </div>
    </motion.div>
  )
}
