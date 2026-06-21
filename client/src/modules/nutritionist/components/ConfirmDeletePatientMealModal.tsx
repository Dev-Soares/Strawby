import { motion, AnimatePresence } from 'framer-motion'
import { Warning } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'

type Props = {
  mealId: string | null
  isPending: boolean
  onClose: () => void
  onConfirm: (mealId: string) => void
}

export default function ConfirmDeletePatientMealModal({ mealId, isPending, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {mealId && (
        <motion.div
          className="fixed inset-0 z-80 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm p-6"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Warning size={20} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Remover refeição?</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-xl py-3 cursor-pointer transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">Cancelar</button>
              <button
                onClick={() => onConfirm(mealId)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-3 disabled:opacity-50 cursor-pointer transition-colors"
              >
                {isPending && <Spinner size={13} />}
                {isPending ? 'Removendo…' : 'Remover'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
