import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { planSchema, type PlanData } from '../types/plan'
import { X, Fire, FloppyDisk, PencilSimple } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Spinner from '@/shared/components/Spinner'
import { MACROS } from '@/shared/config/macros'
import { balanceCarbs, macroKcalShare } from '@/shared/utils/nutrition'

interface PlanEditModalProps {
  isOpen: boolean
  onClose: () => void
  defaultValues: PlanData
  onSave: (data: PlanData) => void
  isPending: boolean
}



export default function PlanEditModal({ isOpen, onClose, defaultValues, onSave, isPending }: PlanEditModalProps) {
  const { handleSubmit, register, watch, setValue } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues,
  })

  const watched = watch()

  const calories = watch('calories')
  const protein = watch('protein')
  const fat = watch('fat')
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
                <X size={15} weight="bold" className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="max-h-[70vh] sm:max-h-none overflow-y-auto">
              {/* Calorie section */}
              <div className="mx-5 sm:mx-8 rounded-2xl bg-linear-to-br from-red-50 to-red-100/40 dark:from-red-950/30 dark:to-red-900/20 border border-red-100 dark:border-red-900/30 px-4 sm:px-8 py-5 sm:py-7 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <Fire size={14} weight="fill" className="text-red-500" />
                  <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-[0.12em] transition-colors duration-300">Meta calórica diária</span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-5">
                  <div className="text-center flex-1 min-w-0">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        {...register('calories', { valueAsNumber: true })}
                        type="number"
                        disabled={isPending}
                        className="font-display text-5xl sm:text-7xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 border-red-300 focus:border-red-500 pb-1 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <PencilSimple size={18} weight="bold" className="text-red-400 shrink-0 -mb-1" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-neutral-400 dark:text-neutral-500 mt-2 transition-colors duration-300">kcal / dia · mín 1000 · máx 5000</p>
                  </div>
                </div>
              </div>

              {/* Macro cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mx-5 sm:mx-8 mt-4 sm:mt-5">
                {MACROS.map((macro) => {
                  const pct = macroKcalShare(macro.field, watched)
                  return (
                  <div
                    key={macro.field}
                    className={`${macro.bg} ${macro.border} border rounded-2xl px-2 sm:px-5 py-4 sm:py-5 flex flex-col items-center`}
                  >
                    <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.14em] ${macro.textColor} mb-3 sm:mb-4`}>
                      {macro.label}
                    </span>

                    <div className="flex items-end justify-center gap-0.5 sm:gap-1 mb-3 w-full">
                      <input
                        {...register(macro.field, { valueAsNumber: true })}
                        type="number"
                        readOnly={macro.field === 'carbs'}
                        tabIndex={macro.field === 'carbs' ? -1 : undefined}
                        disabled={isPending}
                        className={`font-display text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 pb-0.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${macro.field === 'carbs' ? 'cursor-default' : 'cursor-text'}`}
                        style={{ borderBottomColor: `${macro.color}55` }}
                        onFocus={(e) => { if (!isPending && macro.field !== 'carbs') e.currentTarget.style.borderBottomColor = macro.color }}
                        onBlur={(e) => { e.currentTarget.style.borderBottomColor = `${macro.color}55` }}
                      />
                      <span className="text-sm sm:text-base font-bold text-neutral-400 dark:text-neutral-500 pb-1 shrink-0 transition-colors duration-300">g</span>
                      {macro.field !== 'carbs' && (
                        <PencilSimple size={14} weight="bold" className="shrink-0 mb-1.5" style={{ color: `${macro.color}aa` }} />
                      )}
                    </div>

                    <div
                      className="flex items-baseline gap-1 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${macro.color}1f` }}
                    >
                      <span className="text-xs sm:text-sm font-extrabold tabular-nums" style={{ color: macro.color }}>
                        {pct}%
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide" style={{ color: macro.color }}>
                        kcal
                      </span>
                    </div>

                    {macro.field === 'carbs' && (
                      <p className="text-[8px] sm:text-[9px] text-neutral-400 dark:text-neutral-500 mt-2 text-center transition-colors duration-300">
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
                  className="flex-1 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-sm font-bold text-white dark:text-neutral-950 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <Spinner size={16} />
                  ) : (
                    <FloppyDisk size={16} weight="bold" />
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
