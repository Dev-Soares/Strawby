import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import type { MonthlyScoreData } from '../types/monthlyScore'
import DayCell from './DayCell'

interface MonthlyCalendarProps {
  data: MonthlyScoreData
  todayDate: number | null
  onPrevMonth: () => void
  onNextMonth: () => void
}

const weekDayLabels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

export default function MonthlyCalendar({ data, todayDate, onPrevMonth, onNextMonth }: MonthlyCalendarProps) {
  return (
    <section className="mb-5">
      <div className="flex items-start justify-between mb-5 px-1">
        <div>
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            {data.monthLabel} {data.year}
          </h2>
          <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
            Seu desempenho dia a dia
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Mês anterior"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors duration-200 cursor-pointer"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Próximo mês"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors duration-200 cursor-pointer"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3 px-1">
        {weekDayLabels.map((label, idx) => (
          <span
            key={idx}
            className="text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500 transition-colors duration-300"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 sm:gap-3 px-1">
        {Array.from({ length: data.firstDayOffset }).map((_, i) => <div key={`blank-${i}`} />)}
        {data.days.map((day) => (
          <DayCell key={day.date} day={day} isToday={day.date === todayDate} />
        ))}
      </div>
    </section>
  )
}
