import { motion } from 'framer-motion'
import { PencilSimple, Fire, Sparkle } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import PlanEditModal from '../modules/plan/components/PlanEditModal'
import PlanEmptyState from '../modules/plan/components/PlanEmptyState'
import CreatePlanModal from '../modules/plan/components/CreatePlanModal'
import ConfirmDeletePlanModal from '../modules/plan/components/ConfirmDeletePlanModal'
import PlanMealsSection from '../modules/plan/components/PlanMealsSection'
import PlanSkeleton from '../modules/plan/skeletons/PlanSkeleton'
import DownloadPlanPdfButton from '../modules/plan/components/DownloadPlanPdfButton'
import { usePlanPage } from '../modules/plan/hooks/usePlanPage'

export default function PlanPage() {
  const {
    plan,
    isPending,
    isError,
    macroRows,
    editOpen,
    openEdit,
    closeEdit,
    savePlan,
    isSaving,
    createOpen,
    createMode,
    openCreate,
    closeCreate,
    submitCreate,
    isCreating,
    confirmDeleteOpen,
    openConfirmDelete,
    closeConfirmDelete,
    confirmDelete,
    isDeleting,
  } = usePlanPage()

  return (
    <AppLayout>
      {isPending && <PlanSkeleton />}

      {isError && (
        <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8">
          <p className="text-red-500 font-medium">Erro ao carregar plano</p>
        </div>
      )}

      {!isPending && !isError && !plan && (
        <PlanEmptyState
          onManual={() => openCreate('manual')}
          onGenerate={() => openCreate('generate')}
        />
      )}


      {plan && (
        <>
          <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12">
            {/* Header */}
            <motion.div
              className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none transition-colors duration-300">
                  Meu Plano
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 transition-colors duration-300">Seus objetivos nutricionais diários</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
                <button
                  onClick={openConfirmDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <Sparkle size={18} weight="fill" />
                  Gerar plano
                </button>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <PencilSimple size={18} weight="bold" />
                  Editar
                </button>
                <DownloadPlanPdfButton patientId={plan.patientId} compact />
              </div>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* Left — calorie card */}
              <motion.div
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-8 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Fire size={16} weight="fill" className="text-red-500" />
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest transition-colors duration-300">Meta calórica diária</span>
                </div>

                <div className="mb-2">
                  <span className="font-display text-8xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums transition-colors duration-300">
                    {plan.calories.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-base font-semibold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">kcal por dia</p>
              </motion.div>

              {/* Right — macro cards stacked */}
              <div className="flex flex-col gap-4">
                {macroRows.map((macro, index) => (
                    <motion.div
                      key={macro.field}
                      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm px-6 py-5 transition-colors duration-300"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest transition-colors duration-300">{macro.label}</span>
                          <span
                            className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: macro.color, color: macro.track }}
                          >
                            {macro.pct}%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tabular-nums transition-colors duration-300">{macro.value}</span>
                          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">g</span>
                        </div>
                      </div>

                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.track }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: macro.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${macro.pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 sm:mx-10 lg:mx-16 border-t border-neutral-100 dark:border-neutral-800 my-8 transition-colors duration-300" />

          <PlanMealsSection />

          <PlanEditModal
            isOpen={editOpen}
            onClose={closeEdit}
            defaultValues={{
              calories: plan.calories,
              protein: plan.protein,
              carbs: plan.carbs,
              fat: plan.fat,
            }}
            isPending={isSaving}
            onSave={savePlan}
          />
        </>
      )}

      <CreatePlanModal
        isOpen={createOpen}
        onClose={closeCreate}
        onSubmit={submitCreate}
        isPending={isCreating}
        initialMode={createMode}
      />

      <ConfirmDeletePlanModal
        isOpen={confirmDeleteOpen}
        onClose={closeConfirmDelete}
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
    </AppLayout>
  )
}
