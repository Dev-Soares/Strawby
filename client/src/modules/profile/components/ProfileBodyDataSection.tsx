import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Calendar, CirclePlus, Mars, Pencil, Ruler, Venus } from 'lucide-react'
import { useUpdatePatient } from '@/modules/patient/hooks/useUpdatePatient'
import PatientBodyEditModal from '@/modules/auth/components/PatientBodyEditModal'
import { formatBirthDate } from '@/shared/utils/date'
import type { Patient } from '@/modules/patient/types/patient'
import { PROFILE_ACCENTS } from '../config/profileAccents'

const { color, track } = PROFILE_ACCENTS.body

const GENDER_LABEL: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
}

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

  const GenderIcon = patient.gender === 'female' ? Venus : Mars

  const tiles = [
    {
      key: 'height',
      label: 'Altura',
      icon: ArrowUpDown,
      accent: PROFILE_ACCENTS.body,
      value: patient.height ?? '—',
      unit: patient.height !== null ? 'cm' : null,
    },
    {
      key: 'gender',
      label: 'Sexo',
      icon: GenderIcon,
      accent: PROFILE_ACCENTS.nutritionist,
      value: patient.gender ? (GENDER_LABEL[patient.gender] ?? '—') : '—',
      unit: null,
    },
    {
      key: 'birthDate',
      label: 'Nascimento',
      icon: Calendar,
      accent: PROFILE_ACCENTS.since,
      value: patient.birthDate ? formatBirthDate(patient.birthDate) : '—',
      unit: null,
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: track }}
        >
          <Ruler size={18} style={{ color }} />
        </span>
        <span className="text-base font-bold tracking-tight" style={{ color }}>
          Métricas corporais
        </span>

        {hasData && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Pencil size={14} />
            Editar
          </button>
        )}
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiles.map((tile) => (
            <button
              key={tile.key}
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-left hover:border-neutral-300 dark:hover:border-neutral-700 active:scale-[0.98] transition-all duration-150 cursor-pointer sm:block"
            >
              <div className="flex min-w-0 items-center gap-2 sm:mb-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: tile.accent.track }}
                >
                  <tile.icon size={15} style={{ color: tile.accent.color }} />
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
                  {tile.label}
                </span>
              </div>

              <div className="flex min-w-0 shrink-0 items-baseline gap-1">
                <span
                  className="min-w-0 truncate font-display text-xl xl:text-2xl font-extrabold tabular-nums leading-none"
                  style={{ color: tile.accent.color }}
                >
                  {tile.value}
                </span>
                {tile.unit && (
                  <span className="text-sm font-semibold" style={{ color: tile.accent.color }}>
                    {tile.unit}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Altura, sexo e data de nascimento ajudam a calibrar o cálculo do seu plano.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 py-3 text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <CirclePlus size={17} />
            Adicionar métricas
          </button>
        </>
      )}

      <PatientBodyEditModal
        isOpen={open}
        isPending={updatePatient.isPending}
        defaultValues={{
          height: patient.height,
          birthDate: patient.birthDate,
          gender: patient.gender,
        }}
        onClose={() => setOpen(false)}
        onSave={(data) => updatePatient.mutate(data, { onSuccess: () => setOpen(false) })}
      />
    </motion.section>
  )
}
