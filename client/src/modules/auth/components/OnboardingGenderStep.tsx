import { Mars, Venus } from 'lucide-react'
import OnboardingChoiceCard from './OnboardingChoiceCard'

const GENDERS = [
  { value: 'male' as const, label: 'Masculino', Icon: Mars },
  { value: 'female' as const, label: 'Feminino', Icon: Venus },
]

type Gender = (typeof GENDERS)[number]['value']

interface OnboardingGenderStepProps {
  value?: Gender
  onSelect: (gender: Gender) => void
}

export default function OnboardingGenderStep({ value, onSelect }: OnboardingGenderStepProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {GENDERS.map((gender) => (
        <OnboardingChoiceCard
          key={gender.value}
          layout="tile"
          label={gender.label}
          Icon={gender.Icon}
          isSelected={value === gender.value}
          onSelect={() => onSelect(gender.value)}
        />
      ))}
    </div>
  )
}
