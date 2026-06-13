import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { toLocalISODate } from '@/shared/utils/date'
import { useDay } from '../contexts/DayContext'

function iso(d: Date) {
  return toLocalISODate(d)
}

export default function DaySelector() {
  const { selectedDay, setSelectedDay } = useDay()
  const inputRef = useRef<HTMLInputElement>(null)
  const todayIso = useMemo(() => iso(new Date()), [])

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
    const year = d.getFullYear()
    const base = d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).replace(/^\w/, (c) => c.toUpperCase())
    return `${base} (${year})`
  }, [selectedDay, todayIso])

  return (
    <motion.div
      className="mb-8 sm:mb-10 flex justify-center sm:justify-start"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 w-fit bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm px-4 py-3 sm:px-5 sm:py-3.5 transition-colors duration-300">
        <button
          type="button"
          onClick={goPrevDay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150 cursor-pointer shrink-0"
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
            <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 transition-colors duration-150">
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
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150 cursor-pointer shrink-0"
          aria-label="Próximo dia"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>

    </motion.div>
  )
}
