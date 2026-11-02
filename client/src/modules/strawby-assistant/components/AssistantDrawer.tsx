import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ChatContainer from './ChatContainer'

interface AssistantDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AssistantDrawer({ isOpen, onClose }: AssistantDrawerProps) {
  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('overflow-hidden')
    document.documentElement.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
      document.documentElement.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-80 bg-black/50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 top-14 bottom-0 sm:inset-auto sm:top-6 sm:right-6 sm:bottom-6 z-90 w-full sm:w-[45%] sm:min-w-[360px] sm:max-w-[640px] rounded-t-[2rem] sm:rounded-[2rem] bg-white dark:bg-neutral-900 sm:border border-neutral-200 dark:border-neutral-700 shadow-xl"
          >
            <div className="flex h-full flex-col">
              <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 sm:px-6 sm:py-5">
                <div>
                  <h2 className="font-display text-xl font-extrabold text-neutral-950 dark:text-neutral-100">
                    Assistente Strawby
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Pergunte e receba refeições montadas pela IA
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
                  aria-label="Fechar assistente"
                >
                  <X size={20} />
                </button>
              </header>

              <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
                <ChatContainer />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
