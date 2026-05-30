import type { WeekDay, WeekDayStatus } from '../types/weeklyReport'

interface WeekDayBubbleProps {
  day: WeekDay
  isToday?: boolean
}

const statusRing: Record<WeekDayStatus, string> = {
  good: 'ring-emerald-400',
  warn: 'ring-amber-400',
  bad: 'ring-red-400',
  neutral: 'ring-neutral-200',
}

const statusBg: Record<WeekDayStatus, string> = {
  good: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  warn: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  bad: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400',
  neutral: 'bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600',
}

export default function WeekDayBubble({ day, isToday }: WeekDayBubbleProps) {
  const ringClass = statusRing[day.status]
  const bgClass = statusBg[day.status]
  const todayRing = isToday ? `ring-2 ${ringClass} ring-offset-2` : ''

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${bgClass} ${todayRing}`}
      >
        {day.date}
      </div>
      <span className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors duration-300">
        {day.day}
      </span>
    </div>
  )
}
