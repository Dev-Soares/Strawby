import { motion } from 'framer-motion'
import type { WeeklyReportData, WeekDayStatus } from '../types/weeklyReport'

interface WeeklyReportProps {
  data: WeeklyReportData
}

const fullDayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const statusDot: Record<WeekDayStatus, string> = {
  good: 'bg-emerald-500',
  bad: 'bg-red-500',
  neutral: 'bg-neutral-200',
}

export default function WeeklyReport({ data }: WeeklyReportProps) {
  return (
    <motion.div
      className="bg-white rounded-[2rem] shadow-sm relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {/* Topo estilo capa de calendário */}
      <div className="bg-red-600 px-6 sm:px-8 pt-8 pb-5 rounded-t-[2rem]">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Sua semana
          </h2>
          <p className="text-sm text-white/80 mt-1 font-medium">
            Acompanhe seu desempenho
          </p>
        </div>
      </div>

      {/* Corpo com os dias */}
      <div className="p-5 sm:p-6 bg-white">
        <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
          {data.days.map((day, idx) => {
            const isToday = idx === 3

            const borderClass = isToday
              ? 'border-red-200 shadow-sm shadow-red-100'
              : day.status === 'good' || day.status === 'bad'
                ? 'border-neutral-200 hover:border-neutral-300'
                : 'border-neutral-100'

            const headerClass = isToday
              ? 'bg-red-600 text-white'
              : 'bg-neutral-50 text-neutral-400'

            const bodyClass = isToday
              ? 'bg-white text-neutral-900'
              : day.status === 'neutral'
                ? 'bg-neutral-50/50 text-neutral-400'
                : 'bg-white text-neutral-900'

            return (
              <motion.div
                key={day.day + day.date}
                className={`flex flex-col rounded-xl border overflow-hidden aspect-[5/6] transition-all duration-200 cursor-pointer ${borderClass}`}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`text-center py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${headerClass}`}
                >
                  {fullDayNames[idx]}
                </div>
                <div className={`flex-1 flex flex-col items-center justify-center gap-1.5 ${bodyClass}`}>
                  <span className="text-lg sm:text-xl font-black tabular-nums leading-none">
                    {day.date}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot[day.status]}`} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
