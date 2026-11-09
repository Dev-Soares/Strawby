import { useBirthDateSelect } from '../hooks/useBirthDateSelect'
import OnboardingSelect from './OnboardingSelect'

interface OnboardingBirthDateStepProps {
  /** Data no formato 'YYYY-MM-DD'. */
  value?: string
  onChange: (iso?: string) => void
}

export default function OnboardingBirthDateStep({
  value,
  onChange,
}: OnboardingBirthDateStepProps) {
  const { parts, days, years, monthLabels, setDay, setMonth, setYear, pad } = useBirthDateSelect({
    value,
    onChange,
  })

  const fields = [
    {
      label: 'Dia',
      selected: parts.day,
      onSelect: setDay,
      options: days.map((day) => ({ value: pad(day), label: String(day) })),
    },
    {
      label: 'Mês',
      selected: parts.month,
      onSelect: setMonth,
      options: monthLabels.map((label, index) => ({ value: pad(index + 1), label })),
    },
    {
      label: 'Ano',
      selected: parts.year,
      onSelect: setYear,
      options: years.map((year) => ({ value: String(year), label: String(year) })),
    },
  ]

  return (
    <div className="grid grid-cols-[1fr_1.6fr_1.1fr] gap-2 sm:gap-3">
      {fields.map(({ label, selected, onSelect, options }) => (
        <OnboardingSelect
          key={label}
          label={label}
          value={selected}
          options={options}
          onSelect={(next) => onSelect(Number(next))}
        />
      ))}
    </div>
  )
}
