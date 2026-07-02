import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, FloppyDisk, Target, TrendDown, TrendUp, Minus, ArrowRight } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'
import { targetWeightSchema, type TargetWeightFormData } from '@/modules/patient/types/targetWeight'

interface Props {
  isOpen: boolean
  isPending: boolean
  defaultTarget?: number | null
  currentWeight?: number | null
  onClose: () => void
  onSave: (data: TargetWeightFormData) => void
}

export default function TargetWeightModal({
  isOpen,
  isPending,
  defaultTarget,
  currentWeight,
  onClose,
  onSave,
}: Props) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<TargetWeightFormData>({
    resolver: zodResolver(targetWeightSchema),
  })

  useEffect(() => {
    if (isOpen) reset({ targetWeight: defaultTarget ?? undefined })
  }, [isOpen, defaultTarget, reset])

  const onSubmit = handleSubmit((data) => onSave(data))

  const typed = watch('targetWeight')
  const hasTyped = typeof typed === 'number' && !isNaN(typed)
  const diff =
    hasTyped && typeof currentWeight === 'number' ? +(typed - currentWeight).toFixed(1) : null
  // objetivo derivado do peso atual vs meta (banda ±1kg)
  const hint =
    diff === null
      ? null
      : Math.abs(diff) <= 1
        ? { Icon: Minus, text: 'Manter o peso atual' }
        : diff < 0
          ? { Icon: TrendDown, text: `${Math.abs(diff)} kg a perder até a meta` }
          : { Icon: TrendUp, text: `${Math.abs(diff)} kg a ganhar até a meta` }

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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
                  <Target size={16} weight="bold" className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-tight">
                    Meta de peso
                  </h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Peso que você quer alcançar</p>
                </div>
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
              {/* atual → meta */}
              <div className="flex items-stretch gap-2">
                <div className="flex-1 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 px-4 py-3">
                  <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Atual</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-extrabold text-neutral-900 dark:text-white leading-none">
                      {typeof currentWeight === 'number' ? currentWeight : '—'}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">kg</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <ArrowRight size={16} weight="bold" className="text-neutral-300 dark:text-neutral-600" />
                </div>

                <div className="flex-1 rounded-2xl bg-orange-50 dark:bg-orange-950/25 border border-orange-100 dark:border-orange-950/40 px-4 py-3">
                  <p className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1">Meta</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl font-extrabold text-orange-600 dark:text-orange-400 leading-none">
                      {hasTyped ? typed : '—'}
                    </span>
                    <span className="text-xs font-bold text-orange-400 dark:text-orange-500/70">kg</span>
                  </div>
                </div>
              </div>

              {/* input */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                  Qual seu peso ideal?
                </label>
                <div className="relative">
                  <input
                    {...register('targetWeight', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    autoFocus
                    placeholder="Ex.: 72"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 pr-9 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-all duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 dark:text-neutral-500">kg</span>
                </div>
                {errors.targetWeight ? (
                  <p className="text-[10px] font-semibold text-red-500 mt-1.5">{errors.targetWeight.message}</p>
                ) : hint ? (
                  <p className="text-[10px] font-bold text-orange-500 dark:text-orange-400 mt-1.5 flex items-center gap-1">
                    <hint.Icon size={12} weight="bold" />
                    {hint.text}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-neutral-950 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Spinner size={15} className="border-white/30 dark:border-neutral-950/30 border-t-white dark:border-t-neutral-950" />
                ) : (
                  <FloppyDisk size={15} weight="bold" />
                )}
                {isPending ? 'Salvando…' : 'Salvar meta'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
