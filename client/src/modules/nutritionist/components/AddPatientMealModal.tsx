import { motion, AnimatePresence } from 'framer-motion'
import { PATIENT_MEAL_TYPES } from '../config/patientMealTypes'

type Props = {
  isOpen: boolean
  isPending: boolean
  onClose: () => void
  onSelect: (mealType: string) => void
}

export default function AddPatientMealModal({ isOpen, isPending, onClose, onSelect }: Props) {
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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100">Nova refeição planejada</h2>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300 text-xs font-bold">✕</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-2">
              {PATIENT_MEAL_TYPES.map(({ value, label, Icon, color }) => (
                <button
                  key={value}
                  onClick={() => onSelect(value)}
                  disabled={isPending}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50 text-left"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                    <Icon size={18} weight="bold" style={{ color }} />
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
