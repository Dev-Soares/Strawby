import { AnimatePresence, motion } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'

interface ConfirmDeletePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export default function ConfirmDeletePlanModal({ isOpen, onClose, onConfirm, isPending }: ConfirmDeletePlanModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-80 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="p-7 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <Warning size={28} weight="fill" className="text-red-500" />
              </div>

              <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight mb-2">
                Refazer plano?
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-7">
                Isso apagará seu plano atual permanentemente. Você precisará criar um novo plano em seguida.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <Spinner size={16} />
                  ) : (
                    'Sim, apagar'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
