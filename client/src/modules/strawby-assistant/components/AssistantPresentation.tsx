import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { Bubble, BubbleContent } from '@/components/ui/bubble'

type AssistantPresentationState = 'welcome' | 'typing' | 'response'

interface AssistantPresentationProps {
  state: AssistantPresentationState
  response?: string
}

export default function AssistantPresentation({ state, response }: AssistantPresentationProps) {
  const { data: user } = useAuth()
  const username = user?.name?.split(' ')[0] ?? 'Strawber'

  return (
    <div className="relative h-64 w-full sm:h-80">
      <img
        src="/mascot/mascot-smile.webp"
        alt=""
        className="absolute bottom-0 left-0 h-40 w-40 object-contain drop-shadow-xl sm:h-56 sm:w-56"
      />

      <motion.div
        layout
        className="absolute bottom-44 left-16 max-w-[260px] sm:bottom-60 sm:left-24 sm:max-w-[340px]"
      >
        <Bubble variant="outline" align="start">
          <BubbleContent className="px-5 py-3.5 text-base sm:px-6 sm:py-4 sm:text-lg">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {state === 'welcome' && (
                  <>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      Oi, {username}!
                    </span>{' '}
                    Sou o assistente Strawby, como posso te ajudar hoje?
                  </>
                )}
                {state === 'typing' && (
                  <span className="flex items-center gap-1 px-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 dark:bg-neutral-500 [animation-delay:0.3s]" />
                  </span>
                )}
                {state === 'response' && response}
              </motion.div>
            </AnimatePresence>
          </BubbleContent>
        </Bubble>
      </motion.div>
    </div>
  )
}
