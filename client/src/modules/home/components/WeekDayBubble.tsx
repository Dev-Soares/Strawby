import type { WeekDayStatus } from '../types/weeklyReport'
import type { WeekDayBubbleProps } from '../types/weekDayBubble'

const statusRing: Record<WeekDayStatus, string> = {
  good: 'ring-emerald-400',
  warn: 'ring-amber-400',
  bad: 'ring-red-400',
  neutral: 'ring-neutral-200',
}

const statusBg: Record<WeekDayStatus, string> = {
  good: 'bg-emerald-50 text-emerald-700',
  warn: 'bg-amber-50 text-amber-700',
  bad: 'bg-red-50 text-red-700',
  neutral: 'bg-neutral-50 text-neutral-300',
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
      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
        {day.day}
      </span>
    </div>
  )
}
