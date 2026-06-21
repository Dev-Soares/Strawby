import { useState } from 'react'
import { GenderMale, GenderFemale, ArrowsVertical, Calendar, PencilSimple, PlusCircle, TrendDown, TrendUp, Minus } from '@phosphor-icons/react'
import { useUpdatePatient } from '@/modules/patient/hooks/useUpdatePatient'
import PatientBodyEditModal from '@/modules/auth/components/PatientBodyEditModal'
import { formatBirthDate } from '@/shared/utils/date'
import type { Patient } from '@/modules/patient/types/patient'

const GENDER_LABEL: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
}

const GOAL_CONFIG = {
  lose: { label: 'Perder peso', Icon: TrendDown, color: 'orange' },
  gain: { label: 'Ganhar massa', Icon: TrendUp, color: 'teal' },
  mantain: { label: 'Manter peso', Icon: Minus, color: 'sky' },
} as const

interface Props {
  patient: Patient
}

export default function ProfileBodyDataSection({ patient }: Props) {
  const updatePatient = useUpdatePatient()
  const [open, setOpen] = useState(false)

  const hasData =
    patient.height !== null ||
    patient.birthDate !== null ||
    patient.gender !== null

  const goal = patient.goal ? GOAL_CONFIG[patient.goal] : null
  const GoalIcon = goal?.Icon

  return (
    <section className="mb-5">
      <div className="flex items-start justify-between mb-5 px-1">
        <div>
          <h2 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
            Métricas corporais
          </h2>
          <p className="font-display text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
            {hasData ? 'Seus dados físicos atuais' : 'Nenhuma métrica registrada ainda'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm sm:text-xs font-bold px-4 py-2.5 sm:px-3 sm:py-2 rounded-xl transition-colors duration-200 cursor-pointer shrink-0"
        >
          <PencilSimple size={16} weight="bold" />
          Editar
        </button>
      </div>

      {hasData ? (
        <div className="flex flex-col gap-1">

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-emerald-50/60 dark:hover:bg-emerald-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200 dark:shadow-emerald-950/40">
              <ArrowsVertical size={22} weight="bold" className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-400 dark:text-emerald-500 uppercase tracking-widest mb-0.5">Altura</p>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {patient.height ?? '—'}
                </span>
                {patient.height !== null && (
                  <span className="text-sm font-bold text-emerald-400 dark:text-emerald-500">cm</span>
                )}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-blue-50/60 dark:hover:bg-blue-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-200 dark:shadow-blue-950/40">
              {patient.gender === 'female' ? (
                <GenderFemale size={22} weight="bold" className="text-white" />
              ) : (
                <GenderMale size={22} weight="bold" className="text-white" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-0.5">Sexo</p>
              <span className="font-display text-2xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                {patient.gender ? (GENDER_LABEL[patient.gender] ?? '—') : '—'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-violet-50/60 dark:hover:bg-violet-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center shrink-0 shadow-md shadow-violet-200 dark:shadow-violet-950/40">
              <Calendar size={22} weight="bold" className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-violet-400 dark:text-violet-500 uppercase tracking-widest mb-0.5">Data de nascimento</p>
              <span className="font-display text-2xl font-extrabold text-violet-600 dark:text-violet-400 leading-none">
                {patient.birthDate ? formatBirthDate(patient.birthDate) : '—'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-orange-50/60 dark:hover:bg-orange-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow-md shadow-orange-200 dark:shadow-orange-950/40">
              {GoalIcon ? <GoalIcon size={22} weight="bold" className="text-white" /> : <Minus size={22} weight="bold" className="text-white" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-400 dark:text-orange-500 uppercase tracking-widest mb-0.5">Objetivo</p>
              <span className="font-display text-2xl font-extrabold text-orange-600 dark:text-orange-400 leading-none">
                {goal?.label ?? '—'}
              </span>
            </div>
          </button>

        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors duration-150 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <PlusCircle size={22} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
          </div>
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Adicionar suas métricas
          </span>
        </button>
      )}

      <PatientBodyEditModal
        isOpen={open}
        isPending={updatePatient.isPending}
        defaultValues={{
          height: patient.height,
          birthDate: patient.birthDate,
          gender: patient.gender,
          goal: patient.goal,
        }}
        onClose={() => setOpen(false)}
        onSave={(data) => updatePatient.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </section>
  )
}
