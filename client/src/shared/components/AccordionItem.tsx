import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'

type Props = {
  question: string
  answer: string
}

export default function AccordionItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div layout className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 sm:px-6"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-neutral-950 dark:text-neutral-100 sm:text-base">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"
        >
          <CaretDown size={16} weight="bold" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.34, 1.05, 0.64, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 sm:px-6">
              <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
              <p className="pt-4 text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
