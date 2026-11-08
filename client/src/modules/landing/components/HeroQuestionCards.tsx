import { motion } from 'framer-motion'

const questions = [
  {
    label: 'Quanto devo comer?',
    position: 'left-2 sm:left-0 top-5 sm:top-7',
    rotation: '-rotate-6',
    duration: 4.8,
    delay: 0.2,
  },
  {
    label: 'Como acompanhar?',
    position: 'left-1/2 -translate-x-1/2 -top-5 sm:-top-7',
    rotation: 'rotate-3',
    duration: 5.2,
    delay: 0.1,
  },
  {
    label: 'Estou no caminho certo?',
    position: 'right-2 sm:right-0 top-9 sm:top-11',
    rotation: 'rotate-6',
    duration: 5.6,
    delay: 0.32,
  },
] as const

const ease = [0.34, 1.05, 0.64, 1] as const

const HeroQuestionCards = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {questions.map(({ label, position, rotation, duration, delay }) => (
        <motion.div
          key={label}
          className={`absolute ${position}`}
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease }}
        >
          <motion.span
            className={`inline-block ${rotation} whitespace-nowrap rounded-2xl border-2 border-stone-200 bg-white px-3.5 py-2 font-display text-[13px] font-black text-neutral-700 shadow-sm shadow-neutral-900/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 sm:px-4 sm:py-2.5 sm:text-sm`}
            animate={{ y: [0, -1.5, 0] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay + 0.3,
            }}
          >
            {label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  )
}

export default HeroQuestionCards
