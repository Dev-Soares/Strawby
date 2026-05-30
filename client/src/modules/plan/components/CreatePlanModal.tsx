import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Fire,
  PencilSimple,
  Sparkle,
  TrendDown,
  TrendUp,
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

type Mode = 'select' | 'manual' | 'generate'
type GenerateStep = 1 | 2

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePlanData) => void
  isPending: boolean
  initialMode?: Mode
}

const ACTIVITY_OPTIONS = [
  { value: 1.2, label: 'Sedentário', description: 'Pouca ou nenhuma atividade física' },
  { value: 1.375, label: 'Levemente ativo', description: 'Exercícios leves 1–3x por semana' },
  { value: 1.55, label: 'Moderadamente ativo', description: 'Exercícios moderados 3–5x por semana' },
  { value: 1.725, label: 'Muito ativo', description: 'Exercícios intensos 6–7x por semana' },
  { value: 1.9, label: 'Extremamente ativo', description: 'Treino diário intenso ou trabalho físico' },
]

export default function CreatePlanModal({ isOpen, onClose, onSubmit, isPending, initialMode = 'select' }: CreatePlanModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [step, setStep] = useState<GenerateStep>(1)

  const manualForm = useForm<ManualPlanData>({
    resolver: zodResolver(manualPlanSchema),
    defaultValues: { calories: 2000, protein: 150, carbs: 250, fat: 70 },
  })

  const generateForm = useForm<GeneratePlanData>({
    resolver: zodResolver(generatePlanSchema),
    defaultValues: { movementLevel: 1.375 },
  })

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setStep(1)
      manualForm.reset()
      generateForm.reset({ movementLevel: 1.375 })
    }
  }, [isOpen, initialMode])

  const handleClose = () => {
    setMode('select')
    setStep(1)
    manualForm.reset()
    generateForm.reset({ movementLevel: 1.375 })
    onClose()
  }

  const handleBack = () => {
    if (mode === 'generate' && step > 1) {
      setStep(1)
    } else {
      setMode('select')
      setStep(1)
    }
  }

  const handleGenerateNext = async () => {
    const valid = await generateForm.trigger(['goal'])
    if (valid) setStep(2)
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <div className="flex items-center gap-3">
                {showBack && (
                  <button type="button" onClick={handleBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors cursor-pointer">
                    <ArrowLeft size={15} weight="bold" className="text-neutral-600" />
                  </button>
                )}
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight">{title}</h2>
                  {mode === 'generate' && <p className="text-xs text-neutral-400 mt-0.5">Etapa {step} de 2</p>}
                </div>
              </div>
              <button type="button" onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer">
                <X size={15} weight="bold" className="text-neutral-600" />
              </button>
            </div>

            {/* Progress bar (generate only) */}
            {mode === 'generate' && (
              <div className="mx-8 mb-6 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${(step / 2) * 100}%` }} transition={{ duration: 0.3, ease: 'easeInOut' }} />
              </div>
            )}

            <div className="px-8 pb-8 max-h-[70vh] overflow-y-auto">

              {/* ── Select ── */}
              {mode === 'select' && (
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => setMode('manual')}
                    className="group flex items-center gap-4 p-5 border border-neutral-200 rounded-2xl hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200 text-left cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <PencilSimple size={20} weight="bold" className="text-neutral-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Inserir manualmente</p>
                      <p className="text-xs text-neutral-400 mt-0.5">Já sei os valores e quero inserir direto</p>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-neutral-300 ml-auto shrink-0" />
                  </button>

                  <button type="button" onClick={() => setMode('generate')}
                    className="group flex items-center gap-4 p-5 bg-red-600 hover:bg-red-700 rounded-2xl transition-all duration-200 text-left cursor-pointer">
                    <div className="w-11 h-11 rounded-xl bg-red-500 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <Sparkle size={20} weight="fill" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Gerar plano recomendado</p>
                      <p className="text-xs text-red-200 mt-0.5">Calculado com base no seu perfil</p>
                    </div>
                    <ArrowRight size={16} weight="bold" className="text-red-300 ml-auto shrink-0" />
                  </button>
                </div>
              )}

              {/* ── Manual ── */}
              {mode === 'manual' && (
                <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                  <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Fire size={14} weight="fill" className="text-red-500" />
                      <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-[0.12em]">Meta calórica</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <input
                        {...manualForm.register('calories', { valueAsNumber: true })}
                        type="number"
                        className="flex-1 text-4xl font-extrabold text-neutral-950 bg-transparent outline-none border-b-2 border-red-200 focus:border-red-500 pb-1 transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-base font-semibold text-neutral-400 pb-1.5">kcal</span>
                    </div>
                    {manualForm.formState.errors.calories && <p className="text-xs text-red-500 mt-1">{manualForm.formState.errors.calories.message}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { field: 'protein' as const, label: 'Proteína', color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' },
                      { field: 'carbs' as const, label: 'Carboidratos', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-100' },
                      { field: 'fat' as const, label: 'Gordura', color: '#a855f7', bg: 'bg-purple-50', border: 'border-purple-100' },
                    ]).map((macro) => (
                      <div key={macro.field} className={`${macro.bg} ${macro.border} border rounded-2xl p-4 flex flex-col items-center`}>
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] mb-2" style={{ color: macro.color }}>{macro.label}</span>
                        <div className="flex items-end gap-0.5 w-full justify-center">
                          <input
                            {...manualForm.register(macro.field, { valueAsNumber: true })}
                            type="number"
                            className="w-full text-3xl font-extrabold text-neutral-950 bg-transparent outline-none text-center border-b-2 pb-0.5 transition-colors duration-150 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ borderBottomColor: `${macro.color}55` }}
                            onFocus={(e) => { e.currentTarget.style.borderBottomColor = macro.color }}
                            onBlur={(e) => { e.currentTarget.style.borderBottomColor = `${macro.color}55` }}
                          />
                          <span className="text-sm font-bold text-neutral-400 pb-0.5 shrink-0">g</span>
                        </div>
                        {manualForm.formState.errors[macro.field] && <p className="text-[9px] text-red-500 mt-1">{manualForm.formState.errors[macro.field]?.message}</p>}
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1">
                    {isPending ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FloppyDisk size={16} weight="bold" />}
                    {isPending ? 'Salvando…' : 'Salvar plano'}
                  </button>
                </form>
              )}

              {/* ── Generate ── */}
              {mode === 'generate' && (
                <div>
                  {/* Step 1 — Goal */}
                  {step === 1 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-semibold text-neutral-700 mb-1">Qual é o seu objetivo?</p>
                      <Controller control={generateForm.control} name="goal" render={({ field }) => (
                        <div className="flex flex-col gap-3">
                          {[
                            { value: 'lose' as const, label: 'Perder peso', desc: 'Déficit calórico para emagrecer', Icon: TrendDown },
                            { value: 'gain' as const, label: 'Ganhar massa', desc: 'Superávit calórico para hipertrofia', Icon: TrendUp },
                          ].map((opt) => (
                            <button key={opt.value} type="button" onClick={() => field.onChange(opt.value)}
                              className={`flex items-center gap-4 p-5 border-2 rounded-2xl transition-all duration-200 text-left cursor-pointer ${field.value === opt.value ? 'border-red-500 bg-red-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}`}>
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${field.value === opt.value ? 'bg-red-500' : 'bg-neutral-100'}`}>
                                <opt.Icon size={22} weight="bold" className={field.value === opt.value ? 'text-white' : 'text-neutral-500'} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-neutral-900">{opt.label}</p>
                                <p className="text-xs text-neutral-400 mt-0.5">{opt.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )} />
                      {generateForm.formState.errors.goal && <p className="text-xs text-red-500">{generateForm.formState.errors.goal.message}</p>}
                    </div>
                  )}

                  {/* Step 2 — Activity */}
                  {step === 2 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-neutral-700 mb-1">Nível de atividade física</p>
                      <Controller control={generateForm.control} name="movementLevel" render={({ field }) => (
                        <div className="flex flex-col gap-2">
                          {ACTIVITY_OPTIONS.map((opt) => (
                            <button key={opt.value} type="button" onClick={() => field.onChange(opt.value)}
                              className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl transition-all duration-200 text-left cursor-pointer ${field.value === opt.value ? 'border-red-500 bg-red-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}`}>
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${field.value === opt.value ? 'bg-red-500' : 'bg-neutral-300'}`} />
                              <div>
                                <p className="text-sm font-bold text-neutral-900">{opt.label}</p>
                                <p className="text-xs text-neutral-400">{opt.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )} />
                    </div>
                  )}

                  {/* Nav */}
                  <div className="mt-6">
                    {step < 2 ? (
                      <button type="button" onClick={handleGenerateNext}
                        className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer">
                        Continuar <ArrowRight size={15} weight="bold" />
                      </button>
                    ) : (
                      <button type="button" onClick={handleGenerateSubmit} disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {isPending ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkle size={16} weight="fill" />}
                        {isPending ? 'Gerando…' : 'Gerar meu plano'}
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
