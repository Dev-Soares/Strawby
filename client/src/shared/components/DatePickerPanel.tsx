import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDatePicker } from '../hooks/useDatePicker'

interface DatePickerPanelProps {
  /** Data selecionada em 'YYYY-MM-DD' */
  value: string
  onChange: (iso: string) => void
  onClose: () => void
  align: 'left' | 'center'
}

const weekDayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export default function DatePickerPanel({ value, onChange, onClose, align }: DatePickerPanelProps) {
  const { containerRef, days, monthLabel, todayIso, goPrevMonth, goNextMonth } = useDatePicker({
    value,
    onClose,
  })

  const select = (iso: string) => {
    onChange(iso)
    onClose()
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
      className={`absolute top-full mt-2 z-60 w-[19rem] origin-top rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-900/10 dark:shadow-black/50 p-4 ${
        align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
      }`}
    >
      {/* Cabeçalho do mês */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrevMonth}
          aria-label="Mês anterior"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-150 cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {monthLabel}
        </span>

        <button
          type="button"
          onClick={goNextMonth}
          aria-label="Próximo mês"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-150 cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 mb-1.5">
        {weekDayLabels.map((label, index) => (
          <span
            key={index}
            className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grade do mês */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(({ iso, day, inMonth }) => {
          const isSelected = iso === value
          const isToday = iso === todayIso

          const state = isSelected
            ? 'bg-red-600 text-white font-extrabold shadow-sm'
            : isToday
              ? 'text-red-600 font-extrabold ring-1 ring-inset ring-red-500/40 hover:bg-red-50 dark:hover:bg-red-950/40'
              : inMonth
                ? 'text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800'
                : 'text-neutral-300 dark:text-neutral-600 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800'

          return (
            <button
              key={iso}
              type="button"
              onClick={() => select(iso)}
              className={`h-9 rounded-xl text-sm tabular-nums transition-colors duration-150 cursor-pointer ${state}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => select(todayIso)}
        className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-150 cursor-pointer"
      >
        Hoje
      </button>
    </motion.div>
  )
}
