import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Fire, Plus, PencilSimple, Trash, Sparkle,
  CoffeeIcon, ForkKnifeIcon, LeafIcon, MoonIcon, CookieIcon, Warning,
} from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import CreatePlanModal from '@/modules/plan/components/CreatePlanModal'
import PlanEditModal from '@/modules/plan/components/PlanEditModal'
import { useGetPatientPlan } from '@/modules/nutritionist/hooks/useGetPatientPlan'
import { useCreatePatientPlan } from '@/modules/nutritionist/hooks/useCreatePatientPlan'
import { useEditPatientPlan } from '@/modules/nutritionist/hooks/useEditPatientPlan'
import { useDeletePatientPlan } from '@/modules/nutritionist/hooks/useDeletePatientPlan'
import { useGetPatients } from '@/modules/nutritionist/hooks/useGetPatients'
import { useGetPatientPlanMeals } from '@/modules/nutritionist/hooks/useGetPatientPlanMeals'
import { useCreatePatientPlanMeal } from '@/modules/nutritionist/hooks/useCreatePatientPlanMeal'
import { useDeletePatientPlanMeal } from '@/modules/nutritionist/hooks/useDeletePatientPlanMeal'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Café da manhã', Icon: CoffeeIcon, color: '#ea580c' },
  { value: 'lunch', label: 'Almoço', Icon: ForkKnifeIcon, color: '#16a34a' },
  { value: 'snack', label: 'Lanche', Icon: LeafIcon, color: '#2563eb' },
  { value: 'dinner', label: 'Jantar', Icon: MoonIcon, color: '#9333ea' },
  { value: 'supper', label: 'Ceia', Icon: CookieIcon, color: '#475569' },
]

const MACROS = [
  { field: 'protein' as const, label: 'Proteína', color: '#f59e0b', track: '#fef3c7', unit: 'g' },
  { field: 'carbs' as const, label: 'Carboidratos', color: '#3b82f6', track: '#dbeafe', unit: 'g' },
  { field: 'fat' as const, label: 'Gordura', color: '#a855f7', track: '#f3e8ff', unit: 'g' },
]

export default function NutritionistPatientPage() {
  const navigate = useNavigate()
  const { patientId } = useParams<{ patientId: string }>()
  const id = patientId ?? ''

  const { data: patients } = useGetPatients()
  const patient = patients?.find((p) => p.id === id)

  const { data: plan, isPending: planPending } = useGetPatientPlan(id)
  const createPlanMutation = useCreatePatientPlan(id)
  const editPlanMutation = useEditPatientPlan(id)
  const deletePlanMutation = useDeletePatientPlan(id)

  const { data: meals, isPending: mealsPending } = useGetPatientPlanMeals(id)
  const createMealMutation = useCreatePatientPlanMeal(id)
  const deleteMealMutation = useDeletePatientPlanMeal(id)

  const [createPlanOpen, setCreatePlanOpen] = useState(false)
  const [createPlanMode, setCreatePlanMode] = useState<'select' | 'manual' | 'generate'>('select')
  const [editPlanOpen, setEditPlanOpen] = useState(false)
  const [confirmDeletePlan, setConfirmDeletePlan] = useState(false)
  const [addMealOpen, setAddMealOpen] = useState(false)
  const [confirmDeleteMealId, setConfirmDeleteMealId] = useState<string | null>(null)

  const handleDeletePlan = () => {
    deletePlanMutation.mutate(undefined, { onSuccess: () => setConfirmDeletePlan(false) })
  }

  const handleDeleteMeal = (mealId: string) => {
    deleteMealMutation.mutate(mealId, { onSuccess: () => setConfirmDeleteMealId(null) })
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => navigate('/app/home')}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} weight="bold" />
            Meus pacientes
          </button>
          <p className="text-xs font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">
            Plano do paciente
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
            {patient?.user.name ?? '—'}
          </h1>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">{patient?.user.email}</p>
        </motion.div>

        {/* ── PLAN SECTION ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
              Plano alimentar
            </h2>
            {plan && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditPlanOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <PencilSimple size={12} weight="bold" /> Editar
                </button>
                <button
                  onClick={() => setConfirmDeletePlan(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Trash size={12} weight="bold" /> Remover
                </button>
              </div>
            )}
          </div>

          {planPending && (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />)}
              </div>
            </div>
          )}

          {!planPending && !plan && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setCreatePlanMode('manual'); setCreatePlanOpen(true) }}
                className="flex items-center justify-center gap-2 flex-1 border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-2xl py-6 text-sm font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-all cursor-pointer"
              >
                <PencilSimple size={15} weight="bold" /> Inserir manualmente
              </button>
              <button
                onClick={() => { setCreatePlanMode('generate'); setCreatePlanOpen(true) }}
                className="flex items-center justify-center gap-2 flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl py-6 text-sm font-bold transition-all cursor-pointer"
              >
                <Sparkle size={15} weight="fill" /> Gerar automaticamente
              </button>
            </div>
          )}

          {!planPending && plan && (
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl px-6 py-5 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Fire size={14} weight="fill" className="text-red-500" />
                  <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest">Meta calórica diária</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums leading-none">
                    {plan.calories.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-base font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MACROS.map((macro) => (
                  <div key={macro.field} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex flex-col gap-2 transition-colors duration-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 truncate">{macro.label}</span>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums">{plan[macro.field]}</span>
                      <span className="text-xs font-semibold text-neutral-400">g</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.track }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: macro.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(plan[macro.field] / (macro.field === 'protein' ? 300 : macro.field === 'carbs' ? 600 : 200), 1) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Confirm delete plan */}
          <AnimatePresence>
            {confirmDeletePlan && (
              <motion.div
                className="mt-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex flex-col gap-3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-2">
                  <Warning size={16} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">Remover plano?</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmDeletePlan(false)} className="flex-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 cursor-pointer transition-colors hover:bg-neutral-50">Cancelar</button>
                  <button onClick={handleDeletePlan} disabled={deletePlanMutation.isPending} className="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-2.5 disabled:opacity-50 cursor-pointer transition-colors">
                    {deletePlanMutation.isPending ? '…' : 'Remover'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── PLAN MEALS SECTION ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">Refeições planejadas</h2>
              {meals && <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-0.5">{meals.length} {meals.length === 1 ? 'refeição' : 'refeições'}</p>}
            </div>
            <button
              onClick={() => setAddMealOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Plus size={14} weight="bold" /> Nova refeição
            </button>
          </div>

          {mealsPending && (
            <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />)}
            </div>
          )}

          {!mealsPending && meals?.length === 0 && (
            <div className="flex flex-col items-center text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
              <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mb-1">Nenhuma refeição planejada</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Clique em "Nova refeição" para começar</p>
            </div>
          )}

          {!mealsPending && meals && meals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal, i) => {
                const cfg = MEAL_TYPES.find((m) => m.value === meal.mealType) ?? MEAL_TYPES[0]
                const MealIcon = cfg.Icon
                const totalKcal = Math.round(meal.totals.calories)

                return (
                  <motion.div
                    key={meal.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cfg.color}20` }}>
                          <MealIcon size={18} weight="bold" style={{ color: cfg.color }} />
                        </div>
                        <span className="text-base font-extrabold truncate" style={{ color: cfg.color }}>{meal.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="font-display text-3xl font-extrabold tabular-nums" style={{ color: cfg.color }}>{totalKcal}</span>
                        <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500">kcal</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { l: 'Prot', v: Math.round(meal.totals.protein) },
                          { l: 'Carb', v: Math.round(meal.totals.carbs) },
                          { l: 'Gord', v: Math.round(meal.totals.fat) },
                        ].map(({ l, v }) => (
                          <span key={l} className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                            {v}g {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 flex">
                      <button
                        onClick={() => navigate(`/app/meals/${meal.id}?patientId=${id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <PencilSimple size={13} weight="bold" /> Editar alimentos
                      </button>
                      <div className="w-px bg-neutral-100 dark:bg-neutral-800" />
                      <button
                        onClick={() => setConfirmDeleteMealId(meal.id)}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <Trash size={13} weight="bold" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* ── MODALS ── */}
      <CreatePlanModal
        isOpen={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onSubmit={(data) => createPlanMutation.mutate(data, { onSuccess: () => setCreatePlanOpen(false) })}
        isPending={createPlanMutation.isPending}
        initialMode={createPlanMode}
      />

      {plan && (
        <PlanEditModal
          isOpen={editPlanOpen}
          onClose={() => setEditPlanOpen(false)}
          defaultValues={{ calories: plan.calories, protein: plan.protein, carbs: plan.carbs, fat: plan.fat }}
          isPending={editPlanMutation.isPending}
          onSave={(data) => editPlanMutation.mutate(data, { onSuccess: () => setEditPlanOpen(false) })}
        />
      )}

      {/* Add plan meal modal */}
      <AnimatePresence>
        {addMealOpen && (
          <motion.div
            className="fixed inset-0 z-80 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddMealOpen(false)} />
            <motion.div
              className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <h2 className="text-base font-extrabold text-neutral-950 dark:text-neutral-100">Nova refeição planejada</h2>
                <button onClick={() => setAddMealOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300 text-xs font-bold">✕</button>
              </div>
              <div className="px-6 py-5 flex flex-col gap-2">
                {MEAL_TYPES.map(({ value, label, Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => createMealMutation.mutate(value, { onSuccess: () => setAddMealOpen(false) })}
                    disabled={createMealMutation.isPending}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                      <Icon size={18} weight="bold" style={{ color }} />
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm delete meal */}
      <AnimatePresence>
        {confirmDeleteMealId && (
          <motion.div
            className="fixed inset-0 z-80 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteMealId(null)} />
            <motion.div
              className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-sm p-6"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
            >
              <div className="flex items-start gap-3 mb-4">
                <Warning size={20} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Remover refeição?</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDeleteMealId(null)} className="flex-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-xl py-3 cursor-pointer transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">Cancelar</button>
                <button
                  onClick={() => handleDeleteMeal(confirmDeleteMealId)}
                  disabled={deleteMealMutation.isPending}
                  className="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-3 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {deleteMealMutation.isPending ? '…' : 'Remover'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
