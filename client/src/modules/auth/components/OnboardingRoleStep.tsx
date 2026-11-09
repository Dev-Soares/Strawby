import { HeartPulse, Stethoscope } from 'lucide-react'
import OnboardingChoiceCard from './OnboardingChoiceCard'

const ROLES = [
  {
    value: 'patient' as const,
    label: 'Usuário',
    description: 'Acompanhe sua nutrição e alcance seus objetivos',
    Icon: HeartPulse,
  },
  {
    value: 'nutritionist' as const,
    label: 'Nutricionista',
    description: 'Gerencie pacientes e crie planos alimentares',
    Icon: Stethoscope,
  },
]

type Role = (typeof ROLES)[number]['value']

interface OnboardingRoleStepProps {
  value?: Role
  onSelect: (role: Role) => void
}

export default function OnboardingRoleStep({ value, onSelect }: OnboardingRoleStepProps) {
  return (
    <div className="flex flex-col gap-3">
      {ROLES.map((role) => (
        <OnboardingChoiceCard
          key={role.value}
          label={role.label}
          description={role.description}
          Icon={role.Icon}
          isSelected={value === role.value}
          onSelect={() => onSelect(role.value)}
        />
      ))}
    </div>
  )
}
