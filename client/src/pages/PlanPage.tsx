import { motion } from 'framer-motion'
import { Flame, Pencil, Sparkles } from 'lucide-react'
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
        <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8">
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
          <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12">
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
                  <Sparkles size={18} />
                  Gerar plano
                </button>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <Pencil size={18} />
                  Editar
                </button>
                <DownloadPlanPdfButton patientId={plan.patientId} compact />
              </div>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* Left — calorie card */}
              <motion.div
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm px-6 py-5 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--macro-calories-light)">
                    <Flame size={20} className="text-(--macro-calories)" />
                  </span>
                  <span className="text-base font-bold tracking-tight text-(--macro-calories)">
                    Meta calórica diária
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-none tabular-nums transition-colors duration-300 sm:text-6xl">
                    {plan.calories.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
                    kcal
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
                  É o total que as refeições do dia devem somar.
                </p>
              </motion.div>

              {/* Right — macros do plano */}
              <motion.div
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800 transition-colors duration-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {macroRows.map((macro, index) => (
                  <div key={macro.field} className="px-6 py-5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: macro.track }}
                      >
                        <macro.icon size={20} style={{ color: macro.color }} />
                      </span>
                      <span
                        className="min-w-0 truncate text-base font-bold tracking-tight"
                        style={{ color: macro.color }}
                      >
                        {macro.label}
                      </span>
                      <span className="ml-auto flex shrink-0 items-baseline gap-1">
                        <span className="font-display text-2xl font-extrabold tabular-nums leading-none text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
                          {macro.value}
                        </span>
                        <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">g</span>
                      </span>
                    </div>

                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: macro.track }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: macro.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${macro.pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 + index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
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
