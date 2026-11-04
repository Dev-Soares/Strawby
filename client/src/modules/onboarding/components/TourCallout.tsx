import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SpeechBubble from '@/shared/components/SpeechBubble'
import type { TourLayout } from '../hooks/useTourLayout'
import TourPromptText from './TourPromptText'

interface TourCalloutProps {
  layout: TourLayout['callout']
  /** Centro do mascote na tela — é pra lá que o bico aponta. */
  mascotCenterX: number
  message: string
  /** Altura real do balão, que decide de que lado o bloco cabe. */
  onHeightChange: (height: number) => void
}

const SPRING = { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 } as const

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/**
 * A fala do passo, andando junto com o mascote.
 *
 * A altura é devolvida ao layout porque o texto varia de tamanho — é ela que
 * decide se o bloco cabe acima, abaixo ou ao lado do alvo.
 */
export default function TourCallout({
  layout,
  mascotCenterX,
  message,
  onHeightChange,
}: TourCalloutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const tailOffset = clamp(mascotCenterX - layout.left, 24, layout.width - 24)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(entry.contentRect.height)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [onHeightChange])

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ left: layout.left, top: layout.top, width: layout.width }}
      transition={SPRING}
      className="absolute"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <SpeechBubble
            message={<TourPromptText text={message} />}
            tailClassName="-bottom-1.75 border-r-2 border-b-2"
            tailOffset={tailOffset}
            className="shadow-xl shadow-black/30"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
