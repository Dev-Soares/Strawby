import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex items-end gap-1"
    >
      <StrawbyMascot
        action={action}
        playback={playback}
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
