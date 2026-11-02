import { Cookie, Utensils } from 'lucide-react'

interface AssistantIntentPillsProps {
  onSelectMeal: () => void
  onSelectSnack: () => void
}

const intents = [
  {
    id: 'meal',
    label: 'Quero que você registre uma refeição pra mim',
    icon: Utensils,
  },
  {
    id: 'snack',
    label: 'Quero que você me sugira uma refeição',
    icon: Cookie,
  },
]

export default function AssistantIntentPills({ onSelectMeal, onSelectSnack }: AssistantIntentPillsProps) {
  return (
    <div className="flex flex-col gap-3">
      {intents.map((intent) => {
        const Icon = intent.icon
        const handleClick = intent.id === 'meal' ? onSelectMeal : onSelectSnack

        return (
          <button
            key={intent.id}
            type="button"
            onClick={handleClick}
            className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 text-left text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-red-800 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Icon size={20} />
            </span>
            {intent.label}
          </button>
        )
      })}
    </div>
  )
}
