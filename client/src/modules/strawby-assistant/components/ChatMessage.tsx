import { User } from 'lucide-react'
import type { AssistantMessage, SuggestedMeal } from '../types/chat'

interface ChatMessageProps {
  message: AssistantMessage
  onAddMeal?: (meal: SuggestedMeal) => void
}

export default function ChatMessage({ message, onAddMeal }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-center gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? (
        <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
          <User size={16} />
        </div>
      ) : (
        <div className="shrink-0 h-9 w-9 rounded-full bg-red-50 dark:bg-red-950/30 p-0.5">
          <img
            src="/mascot/mascot-smile.webp"
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
      )}

      <div className={`flex max-w-[85%] flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-red-600 text-white rounded-br-none'
              : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-bl-none shadow-sm'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.suggestedMeals && message.suggestedMeals.length > 0 && (
          <div className="w-full space-y-3">
            {message.suggestedMeals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-neutral-950 dark:text-neutral-100">{meal.name}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {meal.mealType}
                      {meal.time ? ` · ${meal.time}` : ''}
                    </p>
                  </div>
                  {onAddMeal && (
                    <button
                      onClick={() => onAddMeal(meal)}
                      className="shrink-0 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-red-700 cursor-pointer"
                    >
                      Adicionar
                    </button>
                  )}
                </div>

                <ul className="mb-3 space-y-1.5">
                  {meal.items.map((item, index) => (
                    <li
                      key={`${meal.id}-${item.name}-${index}`}
                      className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <span>{item.name}</span>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {item.quantity} {item.unit}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 text-xs">
                  <MacroPill label="Calorias" value={`${meal.totals.calories} kcal`} />
                  <MacroPill label="Proteína" value={`${meal.totals.protein}g`} />
                  <MacroPill label="Carbo" value={`${meal.totals.carbs}g`} />
                  <MacroPill label="Gordura" value={`${meal.totals.fat}g`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-neutral-600 dark:text-neutral-400">
      <span className="font-medium text-neutral-900 dark:text-neutral-200">{label}:</span> {value}
    </span>
  )
}
