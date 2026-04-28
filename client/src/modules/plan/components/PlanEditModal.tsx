import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { planSchema, type PlanData } from '../types/plan'
import { X, Fire, FloppyDisk } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'

interface PlanEditModalProps {
  isOpen: boolean
  onClose: () => void
  defaultValues: PlanData
  onSave: (data: PlanData) => void
}

const macroConfig = [
  {
    label: 'Proteína',
    field: 'proteinG' as const,
    step: 5,
    max: 500,
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    textColor: 'text-amber-600',
    ringFocus: 'focus:ring-amber-300',
  },
  {
    label: 'Carboidratos',
    field: 'carbsG' as const,
    step: 5,
    max: 800,
    color: '#3b82f6',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    textColor: 'text-blue-600',
    ringFocus: 'focus:ring-blue-300',
  },
  {
    label: 'Gordura',
    field: 'fatG' as const,
    step: 5,
    max: 300,
    color: '#a855f7',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    textColor: 'text-purple-600',
    ringFocus: 'focus:ring-purple-300',
  },
]

export default function PlanEditModal({ isOpen, onClose, defaultValues, onSave }: PlanEditModalProps) {
  const { handleSubmit, watch, setValue, register } = useForm<PlanData>({
    resolver: zodResolver(planSchema),
    defaultValues,
  })

  const nudge = (field: keyof PlanData, delta: number, min: number, max: number) => {
    const current = watch(field) || 0
    setValue(field, Math.min(Math.max(current + delta, min), max), { shouldValidate: true })
  }

  const onSubmit = handleSubmit((data) => {
    onSave(data)
    onClose()
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <div>
                <h2 className="text-xl font-black text-neutral-950 tracking-tight">Editar Plano</h2>
                <p className="text-sm text-neutral-400 mt-0.5">Ajuste seus objetivos nutricionais</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <X size={15} weight="bold" className="text-neutral-600" />
              </button>
            </div>

            <form onSubmit={onSubmit}>
              {/* Calorie section */}
              <div className="mx-8 rounded-2xl bg-linear-to-br from-red-50 to-red-100/40 border border-red-100 px-8 py-7">
                <div className="flex items-center gap-2 mb-6">
                  <Fire size={14} weight="fill" className="text-red-500" />
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.12em]">Meta calórica diária</span>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <button
                    type="button"
                    onClick={() => nudge('dailyKcal', -50, 1000, 5000)}
                    className="w-14 h-14 rounded-full border-2 border-red-200 bg-white text-red-600 text-2xl font-black flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all duration-150 cursor-pointer shrink-0"
                  >
                    −
                  </button>

                  <div className="text-center flex-1">
                    <input
                      {...register('dailyKcal', { valueAsNumber: true })}
                      type="number"
                      className="text-7xl font-black text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 border-red-200 focus:border-red-500 pb-1 cursor-text transition-colors duration-150"
                      style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                    />
                    <p className="text-sm font-semibold text-neutral-400 mt-2">kcal / dia · mín 1000 · máx 5000</p>
                    <p className="text-[10px] text-red-400/70 mt-1">clique no número para digitar</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => nudge('dailyKcal', +50, 1000, 5000)}
                    className="w-14 h-14 rounded-full border-2 border-red-200 bg-white text-red-600 text-2xl font-black flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all duration-150 cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Macro cards */}
              <div className="grid grid-cols-3 gap-4 mx-8 mt-5">
                {macroConfig.map((macro) => (
                  <div
                    key={macro.field}
                    className={`${macro.bg} ${macro.border} border rounded-2xl px-5 py-5 flex flex-col items-center`}
                  >
                    <span className={`text-[9px] font-black uppercase tracking-[0.14em] ${macro.textColor} mb-4`}>
                      {macro.label}
                    </span>

                    <div className="flex items-end justify-center gap-1 mb-1 w-full">
                      <input
                        {...register(macro.field, { valueAsNumber: true })}
                        type="number"
                        className="text-5xl font-black text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 pb-0.5 cursor-text transition-colors duration-150"
                        style={{ fontFamily: "'Cabinet Grotesk', sans-serif", borderBottomColor: `${macro.color}55` }}
                        onFocus={(e) => { e.currentTarget.style.borderBottomColor = macro.color }}
                        onBlur={(e) => { e.currentTarget.style.borderBottomColor = `${macro.color}55` }}
                      />
                      <span className="text-base font-bold text-neutral-400 pb-1.5 shrink-0">g</span>
                    </div>

                    <p className="text-[9px] text-neutral-400 mb-5">máx. {macro.max}g</p>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => nudge(macro.field, -macro.step, 0, macro.max)}
                        className="w-9 h-9 rounded-full bg-white shadow-sm hover:shadow-md font-black text-base flex items-center justify-center transition-shadow cursor-pointer"
                        style={{ color: macro.color }}
                      >
                        −
                      </button>
                      <span className="text-[9px] font-bold text-neutral-400">±{macro.step}g</span>
                      <button
                        type="button"
                        onClick={() => nudge(macro.field, +macro.step, 0, macro.max)}
                        className="w-9 h-9 rounded-full bg-white shadow-sm hover:shadow-md font-black text-base flex items-center justify-center transition-shadow cursor-pointer"
                        style={{ color: macro.color }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-8 py-7">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FloppyDisk size={16} weight="bold" />
                  Salvar plano
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
