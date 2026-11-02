import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Bubble, BubbleContent } from '@/components/ui/bubble'

interface AssistantResponseProps {
  content: ReactNode
  contentKey?: string
  isTyping?: boolean
  children?: ReactNode
}

export default function AssistantResponse({
  content,
  contentKey,
  isTyping = false,
  children,
}: AssistantResponseProps) {
  return (
    <div className="space-y-2">
      <div className="relative h-48 w-full sm:h-56">
        <img
          src="/mascot/mascot-smile.webp"
          alt=""
          className="absolute bottom-0 left-0 h-32 w-32 object-contain drop-shadow-xl sm:h-40 sm:w-40"
        />

        <motion.div
          layout
          className="absolute bottom-28 left-14 max-w-[240px] sm:bottom-36 sm:left-20 sm:max-w-[300px]"
        >
          <Bubble variant="outline" align="start">
            <BubbleContent className="px-5 py-3.5 text-base sm:px-6 sm:py-4 sm:text-lg">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={contentKey ?? (typeof content === 'string' ? content : 'response')}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {isTyping ? (
                    <span className="flex items-center gap-1 px-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.3s]" />
                    </span>
                  ) : (
                    content
                  )}
                </motion.div>
              </AnimatePresence>
            </BubbleContent>
          </Bubble>
        </motion.div>
      </div>
      {children}
    </div>
  )
}
