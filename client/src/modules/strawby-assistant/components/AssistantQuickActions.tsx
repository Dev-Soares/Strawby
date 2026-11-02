import { Cookie, ArrowRightLeft, Utensils } from 'lucide-react'

export type AssistantMode = 'meal' | 'substitution' | 'snack'

interface AssistantQuickActionsProps {
  currentMode: AssistantMode
  onChangeMode: (mode: AssistantMode) => void
}

const actions: { mode: AssistantMode; label: string; icon: typeof Utensils }[] = [
  { mode: 'meal', label: 'Registrar refeição', icon: Utensils },
  { mode: 'substitution', label: 'Substituir alimento', icon: ArrowRightLeft },
  { mode: 'snack', label: 'Sugerir lanche', icon: Cookie },
]

export default function AssistantQuickActions({ currentMode, onChangeMode }: AssistantQuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => {
        const Icon = action.icon
        const isActive = action.mode === currentMode

        return (
          <button
            key={action.mode}
            type="button"
            onClick={() => onChangeMode(action.mode)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              isActive
                ? 'bg-red-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <Icon size={14} />
            {action.label}
          </button>
        )
      })}
    </div>
  )
}
