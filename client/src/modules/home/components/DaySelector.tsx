import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react'
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
  return d.toISOString().split('T')[0]
}

export default function DaySelector() {
  const { selectedDay, setSelectedDay } = useDay()
  const inputRef = useRef<HTMLInputElement>(null)
  const todayIso = useMemo(() => iso(new Date()), [])

  const weekDays = useMemo(() => getWeekDays(selectedDay), [selectedDay])

  const goPrevWeek = () => {
    const d = new Date(selectedDay + 'T00:00:00')
    d.setDate(d.getDate() - 7)
    setSelectedDay(iso(d))
  }

  const goNextWeek = () => {
    const d = new Date(selectedDay + 'T00:00:00')
    d.setDate(d.getDate() + 7)
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
      className="mb-5 sm:mb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-neutral-200 shadow-sm px-4 py-3 sm:px-5 sm:py-3.5 mb-3">
        <button
          type="button"
          onClick={goPrevWeek}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Semana anterior"
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
          onClick={goNextWeek}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Próxima semana"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>

      {/* Week strip */}
      <div className="flex items-center justify-between gap-1 sm:gap-1.5">
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
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2.5 sm:py-3 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-sm'
                  : isToday
                    ? 'bg-white text-red-600 border border-red-200 shadow-sm'
                    : 'bg-white text-neutral-500 border border-transparent hover:bg-neutral-100'
              }`}
            >
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-red-100' : isToday ? 'text-red-400' : 'text-neutral-400'}`}>
                {weekLabels[weekIdx]}
              </span>
              <span className={`text-base sm:text-lg font-extrabold tabular-nums leading-tight ${isSelected ? 'text-white' : isToday ? 'text-red-600' : 'text-neutral-800'}`}>
                {dayNum}
              </span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
