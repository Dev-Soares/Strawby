import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { X, FloppyDisk, Target, TrendDown, TrendUp, Minus, ArrowRight } from '@phosphor-icons/react'
import Spinner from '@/shared/components/Spinner'
import { targetWeightSchema, type TargetWeightFormData } from '@/modules/patient/types/targetWeight'

const GOALS = [
  { value: 'lose' as const, label: 'Perder peso', Icon: TrendDown, hint: 'Escolha um valor abaixo do peso atual' },
  { value: 'gain' as const, label: 'Ganhar massa', Icon: TrendUp, hint: 'Escolha um valor acima do peso atual' },
  { value: 'mantain' as const, label: 'Manter peso', Icon: Minus, hint: 'Escolha o peso que quer sustentar' },
]

interface Props {
  isOpen: boolean
  isPending: boolean
  defaultTarget?: number | null
  defaultGoal?: 'lose' | 'gain' | 'mantain' | null
  currentWeight?: number | null
  onClose: () => void
  onSave: (data: TargetWeightFormData) => void
}

export default function TargetWeightModal({
  isOpen,
  isPending,
  defaultTarget,
  defaultGoal,
  currentWeight,
  onClose,
  onSave,
}: Props) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TargetWeightFormData>({
    resolver: zodResolver(targetWeightSchema),
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        goal: defaultGoal ?? undefined,
        targetWeight: defaultTarget ?? undefined,
      })
    }
  }, [isOpen, defaultGoal, defaultTarget, reset])

  const onSubmit = handleSubmit((data) => onSave(data))

  const goal = watch('goal')
  const typed = watch('targetWeight')
  const hasTyped = typeof typed === 'number' && !isNaN(typed)
  const diff =
    hasTyped && typeof currentWeight === 'number' ? +(typed - currentWeight).toFixed(1) : null
  const selectedGoal = GOALS.find((g) => g.value === goal)

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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-y-auto max-h-[90vh]"
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
                    Sua meta
                  </h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Objetivo e peso desejado</p>
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
              {/* Objetivo */}
              <div>
                <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2.5">
                  Objetivo
                </label>
                <div className="flex flex-col gap-2">
                  {GOALS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('goal', value, { shouldValidate: true })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                        goal === value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-50 dark:bg-neutral-800'
                      }`}
                    >
                      <Icon size={16} weight="bold" className={goal === value ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-400 dark:text-neutral-500'} />
                      <span className={`text-sm font-bold ${goal === value ? 'text-orange-700 dark:text-orange-300' : 'text-neutral-600 dark:text-neutral-300'}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.goal && <p className="text-[10px] text-red-500 mt-1.5">{errors.goal.message}</p>}
              </div>

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
                    placeholder="Ex.: 72"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 pr-9 text-sm font-bold text-neutral-900 dark:text-neutral-100 outline-none focus:border-orange-400 dark:focus:border-orange-500 transition-all duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 dark:text-neutral-500">kg</span>
                </div>
                {errors.targetWeight ? (
                  <p className="text-[10px] font-semibold text-red-500 mt-1.5">{errors.targetWeight.message}</p>
                ) : diff !== null && diff !== 0 ? (
                  <p className="text-[10px] font-bold text-orange-500 dark:text-orange-400 mt-1.5 flex items-center gap-1">
                    {diff < 0 ? <TrendDown size={12} weight="bold" /> : <TrendUp size={12} weight="bold" />}
                    {Math.abs(diff)} kg {diff < 0 ? 'a perder' : 'a ganhar'} até a meta
                  </p>
                ) : selectedGoal ? (
                  <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mt-1.5 flex items-center gap-1">
                    <selectedGoal.Icon size={12} weight="bold" />
                    {selectedGoal.hint}
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
