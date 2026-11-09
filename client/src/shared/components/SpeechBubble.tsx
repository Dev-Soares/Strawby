import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface SpeechBubbleProps {
  /** Texto da fala — aceita nós para intercalar ícones no meio da frase. */
  message: ReactNode
  isError?: boolean
  /** Posicionamento do bico — muda conforme o lado em que o mascote está. */
  tailClassName?: string
  /** Distância do bico até a borda esquerda, quando o mascote se move. */
  tailOffset?: number
  className?: string
  children?: ReactNode
}

/**
 * O balão de fala em si, sem o mascote.
 * Usado pelo `MascotSpeech` e pelo fecho do tutorial, quando o mascote pula
 * para o botão do assistente e a fala precisa ir junto.
 */
export default function SpeechBubble({
  message,
  isError = false,
  tailClassName = '-bottom-1.75 left-1/2 -ml-1.5 border-r-2 border-b-2 sm:-left-1.75 sm:bottom-5 sm:ml-0 sm:border-l-2 sm:border-r-0',
  tailOffset,
  className = '',
  children,
}: SpeechBubbleProps) {
  const surface = isError
    ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50'
    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'

  return (
    <div className={`relative rounded-2xl border-2 px-5 py-3.5 ${surface} ${className}`}>
      <motion.span
        initial={false}
        animate={tailOffset === undefined ? undefined : { left: tailOffset - 6 }}
        className={`absolute h-3 w-3 rotate-45 ${surface} ${tailClassName}`}
      />

      <p
        className={`text-center text-[15px] font-bold leading-snug tracking-tight sm:text-left sm:text-base ${
          isError ? 'text-red-700 dark:text-red-300' : 'text-neutral-800 dark:text-neutral-100'
        }`}
      >
        {message}
      </p>

      {children}
    </div>
  )
}
