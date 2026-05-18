import { AnimatePresence, motion } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import PrivateFoodForm, { type PrivateFoodFormProps } from './PrivateFoodForm'

interface PrivateFoodModalProps extends PrivateFoodFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivateFoodModal({ isOpen, onClose, ...formProps }: PrivateFoodModalProps) {
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-8 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X size={15} weight="bold" className="text-neutral-600" />
            </button>

            <PrivateFoodForm {...formProps} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
