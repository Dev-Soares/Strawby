import { motion } from 'framer-motion'
import { Minus, Pencil, Target, TrendingDown, TrendingUp } from 'lucide-react'
import TargetWeightModal from './TargetWeightModal'
import GoalProgressSkeleton from '../skeletons/GoalProgressSkeleton'
import type { Patient } from '@/modules/patient/types/patient'
import { useGoalProgress } from '../hooks/useGoalProgress'
import { PROFILE_ACCENTS } from '../config/profileAccents'

const { color, track } = PROFILE_ACCENTS.goal

const GOAL_ICONS = { maintain: Minus, lose: TrendingDown, gain: TrendingUp } as const

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

  if (isPending) return <GoalProgressSkeleton />

  const direction = goal?.direction ?? 'maintain'
  const GoalIcon = GOAL_ICONS[direction]
  const isMaintaining = direction === 'maintain'
  const remaining = (goal?.absDiff ?? 0).toFixed(1).replace('.', ',')

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: track }}
        >
          <Target size={18} style={{ color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color }}>
          Progresso da meta
        </span>

        {hasGoal && (
          <button
            type="button"
            onClick={openModal}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Pencil size={14} />
            Editar
          </button>
        )}
      </div>

      {!hasGoal && (
        <>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Defina um peso desejado para acompanhar o quanto já avançou rumo à meta.
          </p>

          <button
            type="button"
            onClick={openModal}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 py-3 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Target size={17} className="text-white" />
            <span className="text-sm font-bold text-white">Definir meta de peso</span>
          </button>
        </>
      )}

      {hasGoal && !hasWeight && (
        <>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold leading-none tabular-nums tracking-tight text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
              {target}
            </span>
            <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              kg
            </span>
          </div>

          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Registre seu peso para começar a acompanhar o progresso.
          </p>
        </>
      )}

      {hasGoal && hasWeight && (
        <>
          <div className="flex items-baseline gap-2">
            <span
              className="font-display text-4xl font-extrabold leading-none tabular-nums tracking-tight"
              style={{ color }}
            >
              {Math.round(progress)}%
            </span>
            <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              da meta
            </span>
          </div>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: track }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>

          <div className="mt-2.5 flex items-baseline justify-between text-sm font-semibold tabular-nums">
            <span className="text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
              {start} kg
            </span>
            <span style={{ color }}>{target} kg</span>
          </div>

          <div className="mt-5 rounded-2xl p-4 transition-colors duration-300" style={{ backgroundColor: track }}>
            {isMaintaining ? (
              <p
                className="font-display text-lg font-extrabold leading-tight tracking-tight"
                style={{ color }}
              >
                Você está na faixa da meta
              </p>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold" style={{ color }}>
                  Faltam
                </span>
                <span
                  className="font-display text-2xl font-extrabold leading-none tabular-nums tracking-tight"
                  style={{ color }}
                >
                  {remaining}
                </span>
                <span className="text-base font-bold" style={{ color }}>
                  kg para a meta
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 border-t border-black/5 dark:border-white/10 pt-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/60 dark:bg-white/10">
                <GoalIcon size={13} style={{ color }} />
              </span>
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 transition-colors duration-300">
                Peso atual
              </span>
              <span className="ml-auto flex shrink-0 items-baseline gap-1">
                <span className="font-display text-lg font-extrabold leading-none tabular-nums text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
                  {current}
                </span>
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">kg</span>
              </span>
            </div>
          </div>
        </>
      )}

      <TargetWeightModal
        isOpen={modalOpen}
        isPending={isSaving}
        defaultTarget={patient.targetWeight}
        currentWeight={current}
        onClose={closeModal}
        onSave={saveTarget}
      />
    </motion.section>
  )
}
