import { AnimatePresence, motion } from 'framer-motion'
import SpeechBubble from '@/shared/components/SpeechBubble'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'

interface MascotSpeechProps {
  /** Texto dentro do balão — a fala do mascote ou o erro da validação. */
  message: string
  action: MascotAction
  playback: MascotPlayback
  /** Muda para a animação recomeçar do frame 0. */
  animationKey: string
  isError?: boolean
  /** Tamanho do mascote. */
  mascotClassName?: string
  className?: string
}

/**
 * O par mascote + balão: o texto sai da boca dele, não de um `<h1>`.
 * Usado pelo onboarding, pelo tutorial e pelo assistente.
 */
export default function MascotSpeech({
  message,
  action,
  playback,
  animationKey,
  isError = false,
  mascotClassName = 'h-52 w-52 sm:h-34 sm:w-34',
  className = '',
}: MascotSpeechProps) {
  return (
    // no celular o mascote cresce e fica no centro, com o balão saindo de cima:
    // lado a lado sobra largura pro texto e falta pro mascote
    <div
      className={`flex flex-col-reverse items-center sm:flex-row sm:items-end sm:gap-2 ${className}`}
    >
      <div className="shrink-0">
        <StrawbyMascot
          key={animationKey}
          action={action}
          playback={playback}
          className={`drop-shadow-md ${mascotClassName}`}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="mb-3 max-w-[90%] sm:mb-5 sm:max-w-none"
        >
          {/* bico apontando pro mascote: pra baixo no celular, pro lado no sm+ */}
          <SpeechBubble message={message} isError={isError} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
