import { motion } from 'framer-motion'
import { ChartLine, ForkKnife, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Question = {
  label: string
  Icon: LucideIcon
  /** Onde o balão fica em volta do mascote. */
  position: string
  /** Bolhinhas de pensamento descendo do balão até a cabeça do mascote. */
  trail: [string, string, string]
  /** Inclinação base, como bilhete colado torto. */
  rotate: number
  /** Quanto o balão gira durante o flutuar. */
  drift: number
  duration: number
  delay: number
  accent?: boolean
}

const questions: Question[] = [
  {
    label: 'Quanto devo comer?',
    Icon: ForkKnife,
    position: 'left-0 sm:-left-5 -top-2 sm:-top-1',
    trail: [
      'bottom-[-10px] right-9 h-3 w-3',
      'bottom-[-21px] right-5 h-2 w-2',
      'bottom-[-29px] right-2 h-1.5 w-1.5',
    ],
    rotate: -6,
    drift: 1.6,
    duration: 4.8,
    delay: 0.2,
  },
  {
    label: 'Como acompanhar?',
    Icon: ChartLine,
    position: 'left-1/2 -translate-x-1/2 -top-9 sm:-top-16',
    trail: [
      'bottom-[-10px] left-[47%] h-3 w-3',
      'bottom-[-21px] left-[43%] h-2 w-2',
      'bottom-[-29px] left-[40%] h-1.5 w-1.5',
    ],
    rotate: 3,
    drift: -1.4,
    duration: 5.2,
    delay: 0.1,
    accent: true,
  },
  {
    label: 'Estou no caminho certo?',
    Icon: Target,
    position: 'right-0 sm:-right-5 top-2 sm:top-3',
    trail: [
      'bottom-[-10px] left-10 h-3 w-3',
      'bottom-[-21px] left-6 h-2 w-2',
      'bottom-[-29px] left-3 h-1.5 w-1.5',
    ],
    rotate: 6,
    drift: 1.8,
    duration: 5.6,
    delay: 0.32,
  },
]

/**
 * As dúvidas que rondam a cabeça de quem tenta se alimentar melhor.
 * Entram com um "pop" e ficam respirando em volta do mascote.
 */
const HeroQuestionCards = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {questions.map(({ label, Icon, position, trail, rotate, drift, duration, delay, accent }) => (
        <motion.div
          key={label}
          className={`absolute ${position}`}
          initial={{ opacity: 0, scale: 0.5, y: 16, rotate: rotate - 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate }}
          transition={{ type: 'spring', stiffness: 340, damping: 15, delay }}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -5, 0], rotate: [0, drift, 0] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay + 0.4,
            }}
          >
            <span
              className={`flex items-center gap-1 whitespace-nowrap rounded-2xl border-2 px-2.5 py-1.5 font-display text-[11px] font-black shadow-[3px_3px_0_0_rgba(28,25,23,0.06)] sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-sm ${
                accent
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-stone-200 bg-white text-neutral-700'
              }`}
            >
              <Icon
                size={14}
                strokeWidth={2.75}
                className={accent ? 'shrink-0 text-red-500' : 'shrink-0 text-neutral-400'}
              />
              {label}
            </span>

            {/* as duas maiores repetem o contorno do balão; a última é um ponto sólido */}
            {trail.map((bubble, i) => (
              <span
                key={bubble}
                className={`absolute rounded-full ${bubble} ${
                  i < 2
                    ? `border-2 ${accent ? 'border-red-200 bg-red-50' : 'border-stone-200 bg-white'}`
                    : accent
                      ? 'bg-red-200'
                      : 'bg-stone-200'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default HeroQuestionCards
