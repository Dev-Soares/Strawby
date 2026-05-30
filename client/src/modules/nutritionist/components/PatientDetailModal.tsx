import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, User, Fire, PencilSimple, Trash, Plus, Sparkle, Warning } from '@phosphor-icons/react'
import type { NutritionistPatient } from '../types/patient'
import { useGetPatientPlan } from '../hooks/useGetPatientPlan'
import { useCreatePatientPlan } from '../hooks/useCreatePatientPlan'
import { useEditPatientPlan } from '../hooks/useEditPatientPlan'
import { useDeletePatientPlan } from '../hooks/useDeletePatientPlan'
import CreatePlanModal from '../../plan/components/CreatePlanModal'
import PlanEditModal from '../../plan/components/PlanEditModal'

const MACROS = [
  { field: 'protein' as const, label: 'Proteína', color: '#f59e0b', track: '#fef3c7', unit: 'g' },
  { field: 'carbs' as const, label: 'Carboidratos', color: '#3b82f6', track: '#dbeafe', unit: 'g' },
  { field: 'fat' as const, label: 'Gordura', color: '#a855f7', track: '#f3e8ff', unit: 'g' },
]

interface Props {
  patient: NutritionistPatient | null
  isOpen: boolean
  onClose: () => void
}

export default function PatientDetailModal({ patient, isOpen, onClose }: Props) {
  const [createOpen, setCreateOpen] = useState(false)
  const [createMode, setCreateMode] = useState<'select' | 'manual' | 'generate'>('select')
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const patientId = patient?.id ?? ''

  const { data: plan, isPending: planPending } = useGetPatientPlan(patientId)
  const createMutation = useCreatePatientPlan(patientId)
  const editMutation = useEditPatientPlan(patientId)
  const deleteMutation = useDeletePatientPlan(patientId)

  const handleClose = () => {
    setCreateOpen(false)
    setEditOpen(false)
    setConfirmDelete(false)
    onClose()
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => setConfirmDelete(false),
    })
  }

  const initials = patient?.user.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? ''

  return (
    <>
      <AnimatePresence>
        {isOpen && patient && (
          <motion.div
            className="fixed inset-0 z-80 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

            <motion.div
              className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-neutral-900 z-10 flex items-center justify-between px-7 pt-7 pb-5 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                    {initials ? (
                      <span className="text-sm font-extrabold text-red-600 dark:text-red-400">{initials}</span>
                    ) : (
                      <User size={16} weight="bold" className="text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight truncate transition-colors duration-300">
                      {patient.user.name}
                    </h2>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate transition-colors duration-300">
                      {patient.user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer shrink-0"
                >
                  <X size={13} weight="bold" className="text-neutral-600 dark:text-neutral-300" />
                </button>
              </div>

              <div className="px-7 py-6 flex flex-col gap-5">
                {/* Plan section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest transition-colors duration-300">
                        Plano alimentar
                      </h3>
                    </div>
                    {plan && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditOpen(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer"
                        >
                          <PencilSimple size={12} weight="bold" />
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl px-3 py-2 transition-all duration-200 cursor-pointer"
                        >
                          <Trash size={12} weight="bold" />
                          Remover
                        </button>
                      </div>
                    )}
                  </div>

                  {planPending && (
                    <div className="animate-pulse flex flex-col gap-3">
                      <div className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />)}
                      </div>
                    </div>
                  )}

                  {!planPending && !plan && (
                    <div className="flex flex-col items-center text-center py-8 px-4">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                        <Fire size={22} weight="fill" className="text-neutral-300 dark:text-neutral-600" />
                      </div>
                      <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1 transition-colors duration-300">
                        Nenhum plano definido
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-5 transition-colors duration-300">
                        Crie um plano alimentar para este paciente
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setCreateMode('manual'); setCreateOpen(true) }}
                          className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <PencilSimple size={13} weight="bold" />
                          Manual
                        </button>
                        <button
                          onClick={() => { setCreateMode('generate'); setCreateOpen(true) }}
                          className="flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          <Sparkle size={13} weight="fill" />
                          Gerar automaticamente
                        </button>
                      </div>
                    </div>
                  )}

                  {!planPending && plan && (
                    <motion.div
                      className="flex flex-col gap-3"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      {/* Calories */}
                      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl px-6 py-5 transition-colors duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Fire size={14} weight="fill" className="text-red-500" />
                          <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest">Meta calórica diária</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none transition-colors duration-300">
                            {plan.calories.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-base font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
                        </div>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-3 gap-3">
                        {MACROS.map((macro) => (
                          <div
                            key={macro.field}
                            className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl p-4 flex flex-col gap-2 transition-colors duration-300"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 truncate">
                                {macro.label}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums transition-colors duration-300">
                                {plan[macro.field]}
                              </span>
                              <span className="text-xs font-semibold text-neutral-400">g</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.track }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: macro.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(plan[macro.field] / (macro.field === 'protein' ? 300 : macro.field === 'carbs' ? 600 : 200), 1) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Create plan button when no plan */}
                {!planPending && !plan && (
                  <button
                    onClick={() => { setCreateMode('select'); setCreateOpen(true) }}
                    className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-2xl py-4 text-sm font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all duration-200 cursor-pointer"
                  >
                    <Plus size={15} weight="bold" />
                    Criar plano alimentar
                  </button>
                )}

                {/* Confirm delete */}
                <AnimatePresence>
                  {confirmDelete && (
                    <motion.div
                      className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-5 flex flex-col gap-4 transition-colors duration-300"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-3">
                        <Warning size={18} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-red-700 dark:text-red-400">Remover plano?</p>
                          <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">Esta ação não pode ser desfeita.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleDeleteConfirm}
                          disabled={deleteMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-2.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                          {deleteMutation.isPending
                            ? <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <Trash size={12} weight="bold" />
                          }
                          Remover
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePlanModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => createMutation.mutate(data, { onSuccess: () => setCreateOpen(false) })}
        isPending={createMutation.isPending}
        initialMode={createMode}
      />

      {plan && (
        <PlanEditModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          defaultValues={{ calories: plan.calories, protein: plan.protein, carbs: plan.carbs, fat: plan.fat }}
          isPending={editMutation.isPending}
          onSave={(data) => editMutation.mutate(data, { onSuccess: () => setEditOpen(false) })}
        />
      )}
    </>
  )
}
