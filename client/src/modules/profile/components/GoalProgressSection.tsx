import { Target, TrendDown, TrendUp, Minus, Flag, PencilSimple } from '@phosphor-icons/react'
import TargetWeightModal from './TargetWeightModal'
import GoalProgressSkeleton from '../skeletons/GoalProgressSkeleton'
import type { Patient } from '@/modules/patient/types/patient'
import { useGoalProgress } from '../hooks/useGoalProgress'

const GOAL_ICONS = { maintain: Minus, lose: TrendDown, gain: TrendUp } as const

interface Props {
  patientId: string
  patient: Patient
}

export default function GoalProgressSection({ patientId, patient }: Props) {
  const {
    isPending,
    current,
    start,
    target,
    hasGoal,
    hasWeight,
    progress,
    goal,
    modalOpen,
    openModal,
    closeModal,
    saveTarget,
    isSaving,
  } = useGoalProgress(patientId, patient)

  const modal = (
    <TargetWeightModal
      isOpen={modalOpen}
      isPending={isSaving}
      defaultTarget={patient.targetWeight}
      currentWeight={current}
      onClose={closeModal}
      onSave={saveTarget}
    />
  )

  if (isPending) return <GoalProgressSkeleton />

  // Sem meta definida → CTA pra definir
  if (!hasGoal) {
    return (
      <section className="mb-5">
        <SectionHeader />
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-4 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <Flag size={20} weight="bold" className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 leading-snug">
              Defina um peso desejado para acompanhar seu progresso rumo à meta.
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Target size={17} weight="bold" className="text-white" />
            <span className="text-sm font-bold text-white">Definir meta de peso</span>
          </button>
        </div>
        {modal}
      </section>
    )
  }

  // Tem meta mas ainda sem peso registrado
  if (!hasWeight) {
    return (
      <section className="mb-5">
        <SectionHeader />
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-4 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow-md shadow-orange-200 dark:shadow-orange-950/40">
              <Target size={20} weight="bold" className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 dark:text-orange-500 uppercase tracking-widest mb-0.5">Meta</p>
              <span className="font-display text-2xl font-extrabold text-neutral-900 dark:text-white leading-none">{target} kg</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 leading-snug">
            Registre seu peso para acompanhar o progresso.
          </p>
          <EditButton onClick={openModal} />
        </div>
        {modal}
      </section>
    )
  }

  const GoalIcon = GOAL_ICONS[goal?.direction ?? 'maintain']

  return (
    <section className="mb-5">
      <SectionHeader />

      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 transition-colors duration-300">
        {/* topo: objetivo/meta + editar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow-md shadow-orange-200 dark:shadow-orange-950/40">
              <GoalIcon size={20} weight="bold" className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-orange-400 dark:text-orange-500 uppercase tracking-widest mb-0.5">
                Meta
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-xl font-extrabold text-neutral-900 dark:text-white leading-none">
                  {target}
                </span>
                <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500">kg</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="group flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-500 dark:hover:bg-orange-500 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
          >
            <PencilSimple size={14} weight="bold" className="text-orange-500 dark:text-orange-400 group-hover:text-white transition-colors duration-150" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors duration-150">Editar meta</span>
          </button>
        </div>

        {/* progresso */}
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-bold text-amber-500 dark:text-amber-400 tracking-tight">Progresso</span>
          <span className="font-display text-lg font-extrabold text-amber-500 dark:text-amber-400 leading-none tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* barra de progresso */}
        <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* eixos start → meta */}
        <div className="flex items-center justify-between text-sm font-bold text-neutral-900 dark:text-white">
          <span>{start} kg</span>
          <span>{target} kg</span>
        </div>
      </div>
      {modal}
    </section>
  )
}

function SectionHeader() {
  return (
    <div className="px-1 mb-4">
      <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
        Progresso da meta
      </h2>
      <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
        Rumo ao seu peso desejado
      </p>
    </div>
  )
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-[0.98] transition-all duration-150 cursor-pointer"
    >
      <PencilSimple size={15} weight="bold" className="text-neutral-600 dark:text-neutral-400" />
      <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Editar meta</span>
    </button>
  )
}
