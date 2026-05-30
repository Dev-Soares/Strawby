import { motion } from 'framer-motion'
import { Sparkle, Fire, ChartBar, Lightning } from '@phosphor-icons/react'

interface PlanEmptyStateProps {
  onManual: () => void
  onGenerate: () => void
}

const BENEFITS = [
  { Icon: Fire, text: 'Meta calórica personalizada para seu corpo' },
  { Icon: ChartBar, text: 'Macros calculados por objetivo (perda ou ganho)' },
  { Icon: Lightning, text: 'Baseado na fórmula Mifflin-St Jeor' },
]

export default function PlanEmptyState({ onGenerate }: PlanEmptyStateProps) {
  return (
    <div className="px-4 sm:px-10 lg:px-16 py-16 sm:py-24 flex flex-col items-center text-center">

      

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-[1.1] mb-5 max-w-lg"
      >
        Defina suas metas e{' '}
        <span className="text-red-600">alcance</span>{' '}
        seus objetivos
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-10 max-w-sm"
      >
        Respondendo algumas perguntas sobre seu corpo e objetivo, calculamos automaticamente suas metas diárias de calorias e macronutrientes.
      </motion.p>

      <div className="flex flex-col gap-3 mb-10 text-left w-full max-w-xs">
        {BENEFITS.map(({ Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 flex items-center justify-center shrink-0">
              <Icon size={15} weight="fill" className="text-red-500" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.42 }}
        onClick={onGenerate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-colors duration-200 cursor-pointer text-sm"
      >
        <Sparkle size={16} weight="fill" />
        Gerar meu plano agora
      </motion.button>

    </div>
  )
}
