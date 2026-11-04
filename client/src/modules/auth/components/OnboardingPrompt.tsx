import { AnimatePresence, motion } from 'framer-motion'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'

interface OnboardingPromptProps {
  /** Texto dentro do balão — pergunta do passo ou o erro da validação. */
  message: string
  action: MascotAction
  playback: MascotPlayback
  /** Muda para a animação recomeçar do frame 0. */
  animationKey: string
  isError?: boolean
}

/**
 * A pergunta do passo sai da boca do mascote, não de um `<h1>`.
 * É o mesmo par mascote + balão do assistente, em escala de tela cheia.
 */
export default function OnboardingPrompt({
  message,
  action,
  playback,
  animationKey,
  isError = false,
}: OnboardingPromptProps) {
  return (
    <div className="flex items-end gap-1 sm:gap-2">
      <StrawbyMascot
        key={animationKey}
        action={action}
        playback={playback}
        className="h-26 w-26 shrink-0 drop-shadow-md sm:h-34 sm:w-34"
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`relative mb-5 rounded-2xl border-2 px-5 py-3.5 ${
            isError
              ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50'
              : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
          }`}
        >
          {/* bico do balão apontando pro mascote */}
          <span
            className={`absolute -left-[7px] bottom-5 h-3 w-3 rotate-45 border-b-2 border-l-2 ${
              isError
                ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
            }`}
          />

          <p
            className={`text-[15px] font-bold leading-snug tracking-tight sm:text-base ${
              isError
                ? 'text-red-700 dark:text-red-300'
                : 'text-neutral-800 dark:text-neutral-100'
            }`}
          >
            {message}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
