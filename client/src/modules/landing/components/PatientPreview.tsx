import { motion } from 'framer-motion'
import StatusDot from './StatusDot'

const week = ['good', 'warn', 'bad', 'good', 'empty', 'empty', 'empty'] as const
const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
const macros = [
  { label: 'Proteína', value: 82,  max: 150, color: '#f59e0b' },
  { label: 'Carbos',   value: 200, max: 280, color: '#3b82f6' },
  { label: 'Gordura',  value: 48,  max: 73,  color: '#a855f7' },
]

export default function PatientPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-5 transition-colors duration-300">
      <div className="grid grid-cols-7 gap-1.5">
        {week.map((status, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
            className={`flex flex-col items-center gap-2 rounded-xl py-3 ${
              i === 3 ? 'bg-red-600' : 'bg-neutral-50 dark:bg-neutral-800/50'
            } transition-colors duration-300`}
          >
            <span className={`text-[9px] font-bold tracking-wider ${i === 3 ? 'text-white/60' : 'text-neutral-400'}`}>
              {days[i]}
            </span>
            <StatusDot status={status} />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums transition-colors duration-300">1.310</span>
          <span className="text-xs font-bold text-neutral-400">/ 2.200 kcal</span>
        </div>
        {macros.map((m, i) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">{m.label}</span>
              <span className="text-[10px] font-black tabular-nums" style={{ color: m.color }}>{m.value}g</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-colors duration-300">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(m.value / m.max) * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.34, 1.05, 0.64, 1], delay: 0.2 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
