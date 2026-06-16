import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, FloppyDisk, Scales } from '@phosphor-icons/react'
import { weightRecordSchema, type WeightRecordFormData } from '@/modules/patient/types/weightRecord'

interface Props {
  isOpen: boolean
  isPending: boolean
  defaultWeight?: number
  title?: string
  onClose: () => void
  onSave: (data: WeightRecordFormData) => void
}

export default function WeightRecordModal({
  isOpen,
  isPending,
  defaultWeight,
  title = 'Registrar peso',
  onClose,
  onSave,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WeightRecordFormData>({
    resolver: zodResolver(weightRecordSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({ weight: defaultWeight })
    }
  }, [isOpen, defaultWeight, reset])

  const onSubmit = handleSubmit(onSave)

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
            <div className="flex items-center justify-between px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                  <Scales size={16} weight="bold" className="text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X size={13} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-7 pb-7 flex flex-col gap-5">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Peso{' '}
                  <span className="text-neutral-400 dark:text-neutral-500 normal-case font-semibold">
                    (kg)
                  </span>
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {errors.weight && (
                  <p className="text-[10px] text-red-500 mt-1.5">{errors.weight.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 dark:border-neutral-950/30 border-t-white dark:border-t-neutral-950 rounded-full animate-spin" />
                ) : (
                  <FloppyDisk size={15} weight="bold" />
                )}
                {isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
