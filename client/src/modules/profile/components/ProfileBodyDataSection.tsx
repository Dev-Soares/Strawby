import { useState } from 'react'
import { GenderMale, GenderFemale, Scales, ArrowsVertical, Calendar, PlusCircle, PencilSimple, CaretRight } from '@phosphor-icons/react'
import { useUpdateUser } from '@/modules/auth/hooks/useUpdateUser'
import PatientBodyEditModal from '@/modules/auth/components/PatientBodyEditModal'

const GENDER_LABEL: Record<string, { label: string }> = {
  male: { label: 'Masculino' },
  female: { label: 'Feminino' },
}

interface Patient {
  weight: number | null
  height: number | null
  age: number | null
  gender: string | null
}

interface Props {
  patient: Patient
}

export default function ProfileBodyDataSection({ patient }: Props) {
  const updateUser = useUpdateUser()
  const [open, setOpen] = useState(false)

  const hasData = patient.weight !== null || patient.height !== null || patient.age !== null || patient.gender !== null

  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
          Dados corporais
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <PencilSimple size={15} weight="bold" />
          Editar
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
        {hasData ? (
          <>
            {patient.gender && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  {patient.gender === 'male'
                    ? <GenderMale size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                    : <GenderFemale size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Sexo</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {GENDER_LABEL[patient.gender]?.label ?? '—'}
                  </p>
                </div>
              </div>
            )}

            {patient.weight !== null && (
              <div className={`flex items-center gap-3 px-5 py-4 ${patient.height !== null || patient.age !== null ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Scales size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Peso</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.weight} kg</p>
                </div>
              </div>
            )}

            {patient.height !== null && (
              <div className={`flex items-center gap-3 px-5 py-4 ${patient.age !== null ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <ArrowsVertical size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Altura</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.height} cm</p>
                </div>
              </div>
            )}

            {patient.age !== null && (
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Calendar size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Idade</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.age} anos</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <PlusCircle size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
            </div>
            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              Adicionar peso, idade e sexo
            </span>
            <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 ml-auto shrink-0" />
          </button>
        )}
      </div>

      <PatientBodyEditModal
        isOpen={open}
        isPending={updateUser.isPending}
        defaultValues={{
          weight: patient.weight,
          height: patient.height,
          age: patient.age,
          gender: patient.gender,
        }}
        onClose={() => setOpen(false)}
        onSave={(data) => updateUser.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </section>
  )
}
