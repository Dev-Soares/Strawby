import { AnimatePresence, motion } from 'framer-motion'
import { ArrowClockwise, CheckCircle, WifiSlash } from '@phosphor-icons/react'
import { useOfflineBanner } from '../hooks/useOfflineBanner'

const OfflineBanner = () => {
  const { state, retry } = useOfflineBanner()

  return (
    <AnimatePresence>
      {state !== 'hidden' && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.34, 1.05, 0.64, 1] }}
        >
          {state === 'offline' ? (
            <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-neutral-200 bg-white/95 px-4 py-2.5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                <WifiSlash size={17} weight="bold" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Você está sem conexão
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  Mostrando os últimos dados carregados.
                </p>
              </div>

              <button
                type="button"
                onClick={retry}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <ArrowClockwise size={14} weight="bold" />
                Tentar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50/95 px-4 py-2.5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] backdrop-blur dark:border-emerald-900/50 dark:bg-emerald-950/80">
              <CheckCircle
                size={18}
                weight="fill"
                className="shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                Conexão restabelecida
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineBanner
