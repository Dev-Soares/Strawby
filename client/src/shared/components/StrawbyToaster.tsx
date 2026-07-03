import { Toaster, toast, resolveValue } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react'

const typeIcon: Record<string, { icon: string; Icon: typeof CheckCircle }> = {
  success: { icon: 'text-emerald-500', Icon: CheckCircle },
  error: { icon: 'text-red-500', Icon: WarningCircle },
  blank: { icon: 'text-neutral-400', Icon: Info },
}

export default function StrawbyToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 3500,
        success: { duration: 2500 },
        error: { duration: 4000 },
      }}
    >
      {(t) => {
        const cfg = typeIcon[t.type] ?? typeIcon.blank

        return (
          <AnimatePresence>
            {t.visible && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: 'transform, opacity' }}
                className="flex items-center gap-2.5 max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg px-4 py-3"
              >
                {t.type !== 'loading' && (
                  <cfg.Icon size={20} weight="fill" className={`shrink-0 ${cfg.icon}`} />
                )}

                <span className="flex-1 text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {resolveValue(t.message, t)}
                </span>

                {t.type !== 'loading' && (
                  <button
                    type="button"
                    onClick={() => toast.dismiss(t.id)}
                    className="shrink-0 -mr-1 w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X size={12} weight="bold" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )
      }}
    </Toaster>
  )
}
