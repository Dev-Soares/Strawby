import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import type { MascotAction } from '../types/mascotAction'
import StrawbyMascot from './StrawbyMascot'

/**
 * `loop`   — repete enquanto a fala estiver viva
 * `settle` — toca uma vez e volta pro `idle` em loop
 * `once`   — toca uma vez e congela no último frame
 */
export type MascotPlayback = 'loop' | 'settle' | 'once'

interface MascotMessageProps {
  /** Animação do mascote enquanto esta fala está ativa. */
  action: MascotAction
  playback?: MascotPlayback
  /** Mostra os três pontinhos no lugar do texto. */
  isTyping?: boolean
  children?: ReactNode
}

export default function MascotMessage({
  action,
  playback = 'loop',
  isTyping = false,
  children,
}: MascotMessageProps) {
  const [hasSettled, setHasSettled] = useState(false)

  // nova ação recomeça do zero, mesmo que a anterior já tivesse assentado
  const [playingAction, setPlayingAction] = useState(action)
  if (playingAction !== action) {
    setPlayingAction(action)
    setHasSettled(false)
  }

  const didSettle = playback === 'settle' && hasSettled
  const currentAction = didSettle ? 'idle' : action
  const shouldLoop = playback === 'loop' || didSettle

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-end gap-1"
    >
      <StrawbyMascot
        action={currentAction}
        loop={shouldLoop}
        onComplete={() => setHasSettled(true)}
        className="h-28 w-28 shrink-0 drop-shadow-md sm:h-36 sm:w-36"
      />

      <Bubble variant="outline" align="start" className="mb-4 max-w-55 sm:max-w-75">
        <BubbleContent className="px-5 py-3.5 text-[15px] leading-relaxed">
          {isTyping ? (
            <span className="flex items-center gap-1 px-1 py-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.3s]" />
            </span>
          ) : (
            children
          )}
        </BubbleContent>
      </Bubble>
    </motion.div>
  )
}
