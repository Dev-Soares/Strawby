import { useState } from 'react'
import { GenderMale, GenderFemale, ArrowsVertical, Calendar, PencilSimple, PlusCircle } from '@phosphor-icons/react'
import { useUpdateUser } from '@/modules/auth/hooks/useUpdateUser'
import PatientBodyEditModal from '@/modules/auth/components/PatientBodyEditModal'
import { formatBirthDate } from '@/shared/utils/date'

const GENDER_LABEL: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
}

interface Patient {
  weight: number | null
  height: number | null
  birthDate: string | null
  gender: string | null
}

interface Props {
  patient: Patient
}

export default function ProfileBodyDataSection({ patient }: Props) {
  const updateUser = useUpdateUser()
  const [open, setOpen] = useState(false)

  const hasData =
    patient.height !== null ||
    patient.birthDate !== null ||
    patient.gender !== null

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
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer mt-1 shrink-0"
        >
          <PencilSimple size={12} weight="bold" />
          Editar
        </button>
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">

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
            className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-rose-50/60 dark:hover:bg-rose-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0 shadow-md shadow-rose-200 dark:shadow-rose-950/40">
              {patient.gender === 'female' ? (
                <GenderFemale size={22} weight="bold" className="text-white" />
              ) : (
                <GenderMale size={22} weight="bold" className="text-white" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-400 dark:text-rose-500 uppercase tracking-widest mb-0.5">Sexo</p>
              <span className="font-display text-2xl font-extrabold text-rose-600 dark:text-rose-400 leading-none">
                {patient.gender ? (GENDER_LABEL[patient.gender] ?? '—') : '—'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="col-span-2 flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-violet-50/60 dark:hover:bg-violet-950/15 active:scale-[0.97] transition-all duration-150 cursor-pointer text-left"
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
        isPending={updateUser.isPending}
        defaultValues={{
          height: patient.height,
          birthDate: patient.birthDate,
          gender: patient.gender,
        }}
        onClose={() => setOpen(false)}
        onSave={(data) => updateUser.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </section>
  )
}
