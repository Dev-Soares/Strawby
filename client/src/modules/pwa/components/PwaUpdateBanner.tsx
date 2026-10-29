import { AnimatePresence, motion } from 'framer-motion'
import { ArrowsClockwise, X } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'

interface PwaUpdateBannerProps {
  isVisible: boolean
  isUpdating: boolean
  onUpdate: () => void
  onDismiss: () => void
}

export default function PwaUpdateBanner({ isVisible, isUpdating, onUpdate, onDismiss }: PwaUpdateBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-x-0 top-0 z-90 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pointer-events-none"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.26, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <div className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 px-4 py-3 shadow-lg backdrop-blur-md">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center">
              <ArrowsClockwise size={16} weight="bold" className="text-red-600 dark:text-red-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-neutral-950 dark:text-neutral-100 truncate">
                Nova versão disponível
              </p>
              <p className="hidden sm:block text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">
                Atualize para pegar as últimas melhorias
              </p>
            </div>

            <button
              type="button"
              onClick={onUpdate}
              disabled={isUpdating}
              className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Spinner size={14} /> : null}
              {isUpdating ? 'Atualizando…' : 'Atualizar'}
            </button>

            <button
              type="button"
              onClick={onDismiss}
              disabled={isUpdating}
              aria-label="Atualizar depois"
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <X size={12} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
