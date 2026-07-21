import { ArrowUpIcon, ArrowDownIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const patients = [
  { initials: 'AL', name: 'Ana Lima',    score: 87,  trend: 'up',   label: 'em dia',    scores: [72, 58, 91, 87, 0, 0, 0] },
  { initials: 'JM', name: 'João Mendes', score: 62,  trend: 'down', label: 'irregular', scores: [80, 40, 60, 50, 0, 0, 0] },
  { initials: 'CS', name: 'Carla Souza', score: 100, trend: 'up',   label: 'perfeito',  scores: [95, 100, 90, 100, 0, 0, 0] },
  { initials: 'PC', name: 'Pedro Costa', score: 24,  trend: 'down', label: 'ausente',   scores: [30, 20, 0, 24, 0, 0, 0] },
]

export default function NutritionistPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-2 transition-colors duration-300">
      {patients.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.35, delay: 0.08 + i * 0.07 }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 transition-colors duration-300"
        >
          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-black text-white">{p.initials}</span>
          </div>

          <span className="text-[12px] font-bold text-neutral-900 dark:text-neutral-100 flex-1 truncate transition-colors duration-300">{p.name}</span>

          <div className="flex items-end gap-0.5 h-5 shrink-0">
            {p.scores.map((s, si) => (
              <div
                key={si}
                className={`w-1.5 rounded-sm ${s === 0 ? 'bg-neutral-200 dark:bg-neutral-700' : s >= 80 ? 'bg-emerald-400' : s >= 60 ? 'bg-amber-400' : 'bg-red-400'} transition-colors duration-300`}
                style={{ height: s > 0 ? `${Math.max(20, s)}%` : '20%' }}
              />
            ))}
          </div>

          <div className={`flex items-center gap-0.5 shrink-0 ${p.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {p.trend === 'up' ? <ArrowUpIcon size={9} weight="bold" /> : <ArrowDownIcon size={9} weight="bold" />}
            <span className="text-[9px] font-black">{p.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
