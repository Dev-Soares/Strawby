import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { toLocalISODate } from '@/shared/utils/date'
import { useDay } from '../contexts/DayContext'

const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getWeekDays(anchor: string) {
  const d = new Date(anchor + 'T00:00:00')
  const day = d.getDay() // 0 = Sun
  const start = new Date(d)
  start.setDate(d.getDate() - day)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const curr = new Date(start)
    curr.setDate(start.getDate() + i)
    days.push(curr)
  }
  return days
}

function iso(d: Date) {
  return toLocalISODate(d)
}

export default function DaySelector() {
  const { selectedDay, setSelectedDay } = useDay()
  const inputRef = useRef<HTMLInputElement>(null)
  const todayIso = useMemo(() => iso(new Date()), [])

  const weekDays = useMemo(() => getWeekDays(selectedDay), [selectedDay])

  const goPrevDay = () => {
    const d = new Date(selectedDay + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDay(iso(d))
  }

  const goNextDay = () => {
    const d = new Date(selectedDay + 'T00:00:00')
    d.setDate(d.getDate() + 1)
    setSelectedDay(iso(d))
  }

  const formattedHeader = useMemo(() => {
    const d = new Date(selectedDay + 'T00:00:00')
    const isToday = selectedDay === todayIso
    const year = d.getFullYear()
    const base = d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).replace(/^\w/, (c) => c.toUpperCase())
    if (isToday) return `Hoje (${year})`
    return `${base} (${year})`
  }, [selectedDay, todayIso])

  return (
    <motion.div
      className="mb-8 sm:mb-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200 shadow-sm px-4 py-3 sm:px-5 sm:py-3.5 mb-3">
        <button
          type="button"
          onClick={goPrevDay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Dia anterior"
        >
          <CaretLeft size={18} weight="bold" />
        </button>

          <button
            type="button"
            onClick={() => inputRef.current?.showPicker?.()}
            className="flex items-center gap-2 sm:gap-2.5 text-left cursor-pointer group"
          >
            <CalendarBlank size={16} weight="bold" className="text-red-500" />
            <span className="text-sm sm:text-base font-extrabold text-neutral-900 group-hover:text-red-600 transition-colors duration-150">
              {formattedHeader}
            </span>
            <input
              ref={inputRef}
              type="date"
              value={selectedDay}
              onChange={(e) => e.target.value && setSelectedDay(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
            />
          </button>

        <button
          type="button"
          onClick={goNextDay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Próximo dia"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>

      {/* Week strip */}
      <div className="flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:items-stretch sm:justify-between sm:gap-2">
        {weekDays.map((d) => {
          const isoStr = iso(d)
          const isSelected = isoStr === selectedDay
          const isToday = isoStr === todayIso
          const dayNum = d.getDate()
          const weekIdx = d.getDay()

          return (
            <button
              key={isoStr}
              type="button"
              onClick={() => setSelectedDay(isoStr)}
              className={`relative basis-[calc(25%-6px)] sm:flex-1 flex flex-col items-center justify-center gap-1 rounded-2xl sm:rounded-3xl aspect-[4/5] sm:aspect-auto py-3 sm:py-5 transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md'
                  : isToday
                    ? 'bg-white text-red-600 border border-red-200 shadow-sm'
                    : 'bg-white text-neutral-900 border border-transparent hover:bg-neutral-50'
              }`}
            >
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-red-100' : isToday ? 'text-red-400' : 'text-neutral-400'}`}>
                {weekLabels[weekIdx]}
              </span>
              <span className={`text-2xl sm:text-2xl font-extrabold tabular-nums leading-none ${isSelected ? 'text-white' : isToday ? 'text-red-600' : 'text-neutral-950'}`}>
                {dayNum}
              </span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
