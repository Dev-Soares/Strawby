import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import type { MonthlyScoreData } from '../types/monthlyScore'
import { SCORE_TIERS } from '@/shared/config/score'
import DayCell from './DayCell'

interface MonthlyCalendarProps {
  data: MonthlyScoreData
  todayDate: number | null
  onPrevMonth: () => void
  onNextMonth: () => void
}

const weekDayLabels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

const legend = [
  { label: 'Dia bom', color: SCORE_TIERS.good.color, track: SCORE_TIERS.good.track },
  { label: 'Abaixo', color: SCORE_TIERS.low.color, track: SCORE_TIERS.low.track },
]

const navButton =
  'flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors duration-200 cursor-pointer'

export default function MonthlyCalendar({
  data,
  todayDate,
  onPrevMonth,
  onNextMonth,
}: MonthlyCalendarProps) {
  return (
    <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 transition-colors duration-300">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 transition-colors duration-300">
            <CalendarDays size={18} className="text-red-500" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight truncate transition-colors duration-300">
              {data.monthLabel} {data.year}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
              Meu desempenho dia a dia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={onPrevMonth} aria-label="Mês anterior" className={navButton}>
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={onNextMonth} aria-label="Próximo mês" className={navButton}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDayLabels.map((label, idx) => (
            <span
              key={idx}
              className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500 transition-colors duration-300"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: data.firstDayOffset }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {data.days.map((day) => (
            <DayCell key={day.date} day={day} isToday={day.date === todayDate} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-4 transition-colors duration-300">
        {legend.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-md"
              style={{ backgroundColor: item.track, boxShadow: `inset 0 0 0 2px ${item.color}` }}
            />
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
              {item.label}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-md bg-neutral-100 dark:bg-neutral-800" />
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Sem registro
          </span>
        </span>
      </div>
    </section>
  )
}
