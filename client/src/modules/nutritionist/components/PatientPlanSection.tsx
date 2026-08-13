import { motion, AnimatePresence } from 'framer-motion'
import { Fire, PencilSimple, Trash, Sparkle, Warning } from '@phosphor-icons/react'
import type { Plan } from '../../plan/types/plan'
import { MACROS } from '@/shared/config/macros'
import type { CreatePlanMode } from '../hooks/useNutritionistPatientPage'
import DownloadPlanPdfButton from '../../plan/components/DownloadPlanPdfButton'

type Props = {
  plan: Plan | null | undefined
  planPending: boolean
  hasBodyData: boolean
  confirmDeletePlan: boolean
  isDeletePending: boolean
  onOpenCreatePlan: (mode: CreatePlanMode) => void
  onOpenEditPlan: () => void
  onAskDeletePlan: () => void
  onCancelDeletePlan: () => void
  onConfirmDeletePlan: () => void
}

export default function PatientPlanSection({
  plan, planPending, hasBodyData, confirmDeletePlan, isDeletePending,
  onOpenCreatePlan, onOpenEditPlan, onAskDeletePlan, onCancelDeletePlan, onConfirmDeletePlan,
}: Props) {
  return (
    <section className="mb-10">
      <div className="flex flex-col gap-3 mb-4">
        <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight">
          Plano alimentar
        </h2>
        {plan && (
          <div className="flex items-center gap-2">
            <DownloadPlanPdfButton patientId={plan.patientId} compact />
            <button
              onClick={onOpenEditPlan}
              className="flex items-center gap-2 text-sm font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <PencilSimple size={14} weight="bold" /> Editar
            </button>
            <button
              onClick={onAskDeletePlan}
              className="flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Trash size={14} weight="bold" /> Remover
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onOpenCreatePlan('manual')}
              className="group flex items-center gap-3 flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-2xl p-5 transition-all cursor-pointer text-left active:scale-[0.99]"
            >
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 flex items-center justify-center shrink-0 transition-colors">
                <PencilSimple size={20} weight="bold" className="text-neutral-700 dark:text-neutral-200" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight">Inserir manualmente</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 leading-tight">Defina as metas de macros você mesmo</p>
              </div>
            </button>
            <button
              onClick={() => onOpenCreatePlan('generate')}
              disabled={!hasBodyData}
              className={`group flex items-center gap-3 flex-1 rounded-2xl p-5 transition-all text-left ${
                hasBodyData
                  ? 'bg-red-600 hover:bg-red-700 cursor-pointer active:scale-[0.99]'
                  : 'bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-70'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                hasBodyData ? 'bg-white/20' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}>
                <Sparkle size={20} weight="fill" className={hasBodyData ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-extrabold leading-tight ${hasBodyData ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'}`}>Gerar automaticamente</p>
                <p className={`text-xs mt-0.5 leading-tight ${hasBodyData ? 'text-white/70' : 'text-neutral-400 dark:text-neutral-600'}`}>Calcule as metas pelos dados corporais</p>
              </div>
            </button>
          </div>
          {!hasBodyData && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              Paciente precisa preencher os dados corporais para geração automática
            </p>
          )}
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
              <div key={macro.field} className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 transition-colors duration-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 leading-none">{macro.label}</span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums">{plan[macro.field]}</span>
                  <span className="text-xs font-semibold text-neutral-400">g</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: macro.track }}>
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
              <button onClick={onCancelDeletePlan} className="flex-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl py-2.5 cursor-pointer transition-colors hover:bg-neutral-50">Cancelar</button>
              <button onClick={onConfirmDeletePlan} disabled={isDeletePending} className="flex-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl py-2.5 disabled:opacity-50 cursor-pointer transition-colors">
                {isDeletePending ? '…' : 'Remover'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
