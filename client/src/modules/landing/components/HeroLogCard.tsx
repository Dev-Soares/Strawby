import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const macros = [
  { label: 'P', value: 42, max: 150, color: '#10b981' },
  { label: 'C', value: 68, max: 280, color: '#3b82f6' },
  { label: 'G', value: 14, max: 73, color: '#a855f7' },
]

/** O resultado do registro: o que o Strawby devolve depois do toque no celular. */
const HeroLogCard = () => {
  return (
    <div className="w-49 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm p-3.5 shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600">
          <Check size={12} strokeWidth={3.5} className="text-white" />
        </span>
        <span className="text-[11px] font-bold tracking-wide text-neutral-500 dark:text-neutral-400">
          REGISTRADO
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-2xl font-black tabular-nums text-neutral-900 dark:text-neutral-100">
          620
        </span>
        <span className="text-[11px] font-bold text-neutral-400">kcal</span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {macros.map((macro, i) => (
          <div key={macro.label} className="flex items-center gap-2">
            <span className="w-2 text-[10px] font-black text-neutral-400">
              {macro.label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: macro.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(macro.value / macro.max) * 100}%` }}
                transition={{
                  duration: 0.7,
                  ease: [0.34, 1.05, 0.64, 1],
                  delay: 0.25 + i * 0.1,
                }}
              />
            </div>
            <span className="text-[10px] font-black tabular-nums text-neutral-400">
              {macro.value}g
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroLogCard
