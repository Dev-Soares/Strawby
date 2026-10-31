import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { planSchema, type PlanData } from '../types/plan'
import { Flame, Pencil, Save, X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import Spinner from '@/shared/components/Spinner'
import { MACROS } from '@/shared/config/macros'
import { balanceCarbs, macroKcalShare } from '@/shared/utils/nutrition'
import { nonNegativeInputProps } from '@/shared/utils/nonNegativeInputProps'

interface PlanEditModalProps {
  isOpen: boolean
  onClose: () => void
  defaultValues: PlanData
  onSave: (data: PlanData) => void
  isPending: boolean
}



export default function PlanEditModal({ isOpen, onClose, defaultValues, onSave, isPending }: PlanEditModalProps) {
  const { handleSubmit, register, control, setValue } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues,
  })

  const watched = useWatch({ control, defaultValue: defaultValues }) as PlanData

  const calories = useWatch({ control, name: 'calories' })
  const protein = useWatch({ control, name: 'protein' })
  const fat = useWatch({ control, name: 'fat' })
  useEffect(() => {
    const carbs = balanceCarbs(calories, protein, fat)
    if (carbs === null) return
    setValue('carbs', carbs, { shouldValidate: true, shouldDirty: true })
  }, [calories, protein, fat, setValue])

  const onSubmit = handleSubmit((data) => {
    onSave(data)
  })

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
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">Editar Plano</h2>
                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">Ajuste seus objetivos nutricionais</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X size={15} className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="max-h-[70vh] sm:max-h-none overflow-y-auto">
              {/* Calorie section */}
              <div className="mx-5 sm:mx-8 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-800/40 sm:px-8 sm:py-7">
                <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--macro-calories-light)">
                    <Flame size={18} className="text-(--macro-calories)" />
                  </span>
                  <span className="text-base font-bold tracking-tight text-(--macro-calories)">
                    Meta calórica diária
                  </span>
                </div>

                <div className="flex items-end justify-center gap-2">
                  <input
                    {...register('calories', { valueAsNumber: true })}
                    type="number"
                    {...nonNegativeInputProps}
                    disabled={isPending}
                    className="min-w-0 flex-1 cursor-text border-b-2 border-(--macro-calories-light) bg-transparent pb-1 text-center font-display text-5xl font-extrabold leading-none tabular-nums text-neutral-950 outline-none transition-colors duration-150 [appearance:textfield] focus:border-(--macro-calories) disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 sm:text-7xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 pb-2 text-base font-semibold text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
                    kcal
                  </span>
                  <Pencil size={18} className="mb-2.5 shrink-0 text-(--macro-calories)" />
                </div>
                <p className="mt-3 text-center text-sm text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
                  mín 1000 · máx 5000 kcal por dia
                </p>
              </div>

              {/* Macro cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mx-5 sm:mx-8 mt-4 sm:mt-5">
                {MACROS.map((macro) => {
                  const pct = macroKcalShare(macro.field, watched)
                  // CSS vars no lugar do hex do config: o hex é sempre o tom claro.
                  const color = `var(--macro-${macro.field})`
                  const track = `var(--macro-${macro.field}-light)`
                  const MacroIcon = macro.icon
                  return (
                  <div
                    key={macro.field}
                    className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-2 py-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-800/40 sm:px-5 sm:py-5"
                  >
                    <div className="mb-3 flex w-full min-w-0 items-center justify-center gap-2 sm:mb-4">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: track }}
                      >
                        <MacroIcon size={17} style={{ color }} />
                      </span>
                      <span
                        className="min-w-0 truncate text-sm font-bold tracking-tight"
                        style={{ color }}
                      >
                        {macro.label}
                      </span>
                    </div>

                    <div className="mb-3 flex w-full items-end justify-center gap-0.5 sm:gap-1">
                      <input
                        {...register(macro.field, { valueAsNumber: true })}
                        type="number"
                        {...nonNegativeInputProps}
                        readOnly={macro.field === 'carbs'}
                        tabIndex={macro.field === 'carbs' ? -1 : undefined}
                        disabled={isPending}
                        style={{ borderColor: track }}
                        className={`min-w-0 flex-1 border-b-2 bg-transparent pb-0.5 text-center font-display text-3xl font-extrabold leading-none tabular-nums text-neutral-950 outline-none transition-colors duration-150 [appearance:textfield] disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 sm:text-5xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${macro.field === 'carbs' ? 'cursor-default' : 'cursor-text'}`}
                      />
                      <span className="shrink-0 pb-1 text-sm font-semibold text-neutral-400 transition-colors duration-300 dark:text-neutral-500 sm:text-base">
                        g
                      </span>
                      {macro.field !== 'carbs' && (
                        <Pencil size={14} className="mb-1.5 shrink-0" style={{ color }} />
                      )}
                    </div>

                    <div
                      className="flex items-baseline gap-1 rounded-full px-3 py-1"
                      style={{ backgroundColor: track }}
                    >
                      <span className="text-xs font-extrabold tabular-nums sm:text-sm" style={{ color }}>
                        {pct}%
                      </span>
                      <span className="text-[10px] font-bold sm:text-xs" style={{ color }}>
                        kcal
                      </span>
                    </div>

                    {macro.field === 'carbs' && (
                      <p className="mt-2 text-center text-[10px] text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
                        ajusta automaticamente
                      </p>
                    )}
                  </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-5 sm:px-8 py-5 sm:py-7">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <Spinner size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {isPending ? 'Salvando…' : 'Salvar plano'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
