import { Sparkles, UtensilsCrossed, Apple, Dumbbell } from 'lucide-react'

const suggestions = [
  { icon: UtensilsCrossed, text: 'Monte um café da manhã com 400 kcal e alta proteína' },
  { icon: Apple, text: 'Crie um lanche pré-treino com o que tenho em casa' },
  { icon: Dumbbell, text: 'Sugira um jantar leve para depois do treino' },
]

interface ChatWelcomeProps {
  onSuggestionClick?: (text: string) => void
}

export default function ChatWelcome({ onSuggestionClick }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md">
        <Sparkles size={28} />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-neutral-100">
          Strawby Assistant
        </h2>
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          Descreva suas metas, preferências ou ingredientes disponíveis e deixo que a IA monte refeições para você.
        </p>
      </div>

      <div className="grid w-full max-w-md gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick?.(suggestion.text)}
            className="flex items-center gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-left text-sm text-neutral-700 dark:text-neutral-300 transition-all duration-200 hover:border-red-600/30 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <suggestion.icon size={18} className="shrink-0 text-red-600" />
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
