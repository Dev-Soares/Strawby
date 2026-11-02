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
            <div className="relative flex h-full flex-col">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 shadow-sm hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer"
                aria-label="Fechar assistente"
              >
                <X size={22} />
              </button>

              <div className="flex-1 overflow-hidden px-4 pt-24 pb-4 sm:px-6 sm:pt-20 sm:pb-5">
                <ChatContainer />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
