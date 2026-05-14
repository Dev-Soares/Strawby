import { useState } from 'react'
import { PencilSimple, Fire } from '@phosphor-icons/react'
import AppLayout from '../shared/layouts/AppLayout'
import PlanEditModal from '../modules/plan/components/PlanEditModal'
import PlanMealsSection from '../modules/plan/components/PlanMealsSection'
import PlanSkeleton from '../modules/plan/skeletons/PlanSkeleton'
import { useGetPlan } from '../modules/plan/hooks/useGetPlan'
import { useEditPlan } from '../modules/plan/hooks/useEditPlan'

const macros = [
  { label: 'Proteína', field: 'protein' as const, color: '#f59e0b', trackColor: '#fef3c7', max: 500 },
  { label: 'Carboidratos', field: 'carbs' as const, color: '#3b82f6', trackColor: '#dbeafe', max: 800 },
  { label: 'Gordura', field: 'fat' as const, color: '#a855f7', trackColor: '#f3e8ff', max: 300 },
]

export default function PlanPage() {
  const { data: plan, isPending, isError } = useGetPlan()
  const editMutation = useEditPlan()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <AppLayout>
      {isPending && <PlanSkeleton />}

      {isError && (
        <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8">
          <p className="text-red-500 font-medium">Erro ao carregar plano</p>
        </div>
      )}

      {plan && (
        <>
          <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-none">
                  Meu Plano
                </h1>
                <p className="text-sm text-neutral-500 mt-3">Seus objetivos nutricionais diários</p>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-3 rounded-2xl transition-colors duration-200 cursor-pointer shrink-0"
              >
                <PencilSimple size={16} weight="bold" />
                Editar plano
              </button>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* Left — calorie card */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Fire size={16} weight="fill" className="text-red-500" />
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Meta calórica diária</span>
                </div>

                <div className="mb-2">
                  <span className="font-display text-8xl font-extrabold text-neutral-950 leading-none tabular-nums">
                    {plan.calories.toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-base font-semibold text-neutral-500">kcal por dia</p>
              </div>

              {/* Right — macro cards stacked */}
              <div className="flex flex-col gap-4">
                {macros.map((macro) => {
                  const value = plan[macro.field]
                  const progress = Math.min(value / macro.max, 1)

                  return (
                    <div key={macro.field} className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: macro.color }} />
                          <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{macro.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-neutral-950 tabular-nums">{value}</span>
                          <span className="text-sm font-semibold text-neutral-500">g</span>
                        </div>
                      </div>

                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: macro.trackColor }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress * 100}%`, backgroundColor: macro.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 sm:mx-10 lg:mx-16 border-t border-neutral-100 my-2" />

          <PlanMealsSection />

          <PlanEditModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            defaultValues={{
              calories: plan.calories,
              protein: plan.protein,
              carbs: plan.carbs,
              fat: plan.fat,
            }}
            onSave={(data) => editMutation.mutate(data)}
          />
        </>
      )}
    </AppLayout>
  )
}
