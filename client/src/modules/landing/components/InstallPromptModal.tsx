import { AnimatePresence, motion } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import AndroidGuide from './AndroidGuide'
import IosGuide from './IosGuide'

type Platform = 'android' | 'ios'

interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
  platform: Platform
}

export default function InstallPromptModal({ isOpen, onClose, platform }: InstallPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 bg-white dark:bg-neutral-900 z-10 transition-colors duration-300">
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">
                {platform === 'android' ? 'Instalar no Android' : 'Instalar no iPhone/iPad'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X size={15} weight="bold" className="text-neutral-600 dark:text-neutral-300 transition-colors duration-300" />
              </button>
            </div>

            <div className="px-6 pb-8 overflow-y-auto">
              {platform === 'android' ? <AndroidGuide /> : <IosGuide />}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 shrink-0 bg-white dark:bg-neutral-900 transition-colors duration-300">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-neutral-950 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-bold text-white dark:text-neutral-950 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
