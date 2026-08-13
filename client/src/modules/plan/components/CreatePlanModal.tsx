import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Fire,
  PencilSimple,
  Sparkle,
  ArrowLeft,
  ArrowRight,
  FloppyDisk,
} from '@phosphor-icons/react'
import {
  manualPlanSchema,
  generatePlanSchema,
  type ManualPlanData,
  type GeneratePlanData,
  type CreatePlanData,
} from '../types/createPlan'
import Spinner from '@/shared/components/Spinner'
import { MACROS } from '@/shared/config/macros'
import { ACTIVITY_LEVELS, DEFAULT_ACTIVITY_LEVEL } from '../config/activityLevels'

type Mode = 'select' | 'manual' | 'generate'

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePlanData) => void
  isPending: boolean
  initialMode?: Mode
  isNutritionist?: boolean
}

export default function CreatePlanModal({ isOpen, onClose, onSubmit, isPending, initialMode = 'select', isNutritionist = false }: CreatePlanModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode)

  const manualForm = useForm<ManualPlanData>({
    resolver: zodResolver(manualPlanSchema),
    defaultValues: { calories: 2000, protein: 150, carbs: 250, fat: 70 },
  })

  const generateForm = useForm<GeneratePlanData>({
    resolver: zodResolver(generatePlanSchema),
    defaultValues: { movementLevel: DEFAULT_ACTIVITY_LEVEL },
  })

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      manualForm.reset()
      generateForm.reset({ movementLevel: DEFAULT_ACTIVITY_LEVEL })
    }
  }, [isOpen, initialMode])

  const handleClose = () => {
    setMode('select')
    manualForm.reset()
    generateForm.reset({ movementLevel: DEFAULT_ACTIVITY_LEVEL })
    onClose()
  }

  const handleBack = () => {
    setMode('select')
  }

  const handleManualSubmit = manualForm.handleSubmit((data) => onSubmit(data))
  const handleGenerateSubmit = generateForm.handleSubmit((data) => onSubmit(data))

  const showBack = mode !== 'select'
  const title = mode === 'select' ? 'Criar plano' : mode === 'manual' ? 'Inserir manualmente' : 'Gerar plano recomendado'

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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <div className="flex items-center gap-3">
                {showBack && (
                  <button type="button" onClick={handleBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                    <ArrowLeft size={15} weight="bold" className="text-neutral-600 dark:text-neutral-400" />
                  </button>
                )}
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-50 tracking-tight">{title}</h2>
                </div>
              </div>
              <button type="button" onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer">
                <X size={15} weight="bold" className="text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto overflow-x-hidden">

              {/* ── Select ── */}
              {mode === 'select' && (
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => setMode('manual')}
                    className="group flex items-center gap-4 p-5 border border-neutral-200 dark:border-neutral-700 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 text-left cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <PencilSimple size={20} weight="bold" className="text-neutral-700 dark:text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Inserir manualmente</p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Já sei os valores e quero inserir direto</p>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-neutral-300 dark:text-neutral-600 ml-auto shrink-0" />
                  </button>

                  <button type="button" onClick={() => setMode('generate')}
                    className="group flex items-center gap-4 p-5 bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-200 text-left cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-red-500 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <Sparkle size={20} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Gerar plano recomendado</p>
                      <p className="text-xs text-red-200 mt-0.5">
                        {isNutritionist ? 'Calculado com base no perfil do paciente' : 'Calculado com base no seu perfil'}
                      </p>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-red-300 ml-auto shrink-0" />
                  </button>
                </div>
              )}

              {/* ── Manual ── */}
              {mode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Fire size={14} weight="fill" className="text-red-500" />
                      <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-[0.12em]">Meta calórica</span>
                    </div>
                    <div className="flex items-end gap-2 w-full">
                      <input
                        {...manualForm.register('calories', { valueAsNumber: true })}
                        type="number"
                        className="min-w-0 flex-1 text-center text-4xl font-extrabold text-neutral-950 dark:text-neutral-50 bg-transparent outline-none border-b-2 border-red-200 dark:border-red-800 focus:border-red-500 dark:focus:border-red-400 pb-1 transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-base font-semibold text-neutral-400 dark:text-neutral-500 pb-1.5 shrink-0">kcal</span>
                    </div>
                    {manualForm.formState.errors.calories && <p className="text-xs text-red-500 mt-1">{manualForm.formState.errors.calories.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {MACROS.map((macro) => (
                      <div key={macro.field} className={`${macro.bg} ${macro.border} border rounded-2xl p-4 flex flex-col items-center min-w-0`}>
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] mb-2 truncate w-full text-center" style={{ color: macro.color }}>{macro.label}</span>
                        <div className="flex items-end gap-0.5 w-full justify-center min-w-0">
                          <input
                            {...manualForm.register(macro.field, { valueAsNumber: true })}
                            type="number"
                            className={`min-w-0 w-full text-2xl font-extrabold text-neutral-950 dark:text-neutral-50 bg-transparent outline-none text-center border-b-2 pb-0.5 transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${macro.inputBorder}`}
                          />
                          <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 pb-0.5 shrink-0">g</span>
                        </div>
                        {manualForm.formState.errors[macro.field] && <p className="text-[9px] text-red-500 mt-1">{manualForm.formState.errors[macro.field]?.message}</p>}
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-950 dark:bg-neutral-50 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                    {isPending ? <Spinner size={16} className="border-white/30 dark:border-neutral-950/30 border-t-white dark:border-t-neutral-950" /> : <FloppyDisk size={16} weight="bold" />}
                    {isPending ? 'Salvando…' : 'Salvar plano'}
                  </button>
                </form>
              )}

              {/* ── Generate ── */}
              {mode === 'generate' && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nível de atividade física</p>
                  <Controller control={generateForm.control} name="movementLevel" render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      {ACTIVITY_LEVELS.map((opt) => (
                        <button key={opt.value} type="button" onClick={() => field.onChange(opt.value)}
                          className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl transition-all duration-200 text-left cursor-pointer ${field.value === opt.value ? 'border-red-500 bg-red-50 dark:bg-red-950/30' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${field.value === opt.value ? 'bg-red-500' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                          <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{opt.label}</p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500">{opt.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )} />

                  <button type="button" onClick={handleGenerateSubmit} disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                    {isPending ? <Spinner size={16} /> : <Sparkle size={16} weight="fill" />}
                    {isPending ? 'Gerando…' : isNutritionist ? 'Gerar plano' : 'Gerar meu plano'}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
