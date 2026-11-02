import { useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useAssistantActions } from '../hooks/useAssistantActions'
import type { AddSuggestedMealData } from '../types/snackSuggestion'
import AssistantWelcome from './AssistantWelcome'
import AssistantResponse from './AssistantResponse'
import AssistantIntentPills from './AssistantIntentPills'
import UserChatMessage from './UserChatMessage'
import AssistantTyping from './AssistantTyping'
import ChatInput from './ChatInput'
import SnackInput from './SnackInput'
import SuggestedMealCards from './SuggestedMealCards'
import SnackSuggestions from './SnackSuggestions'

export default function ChatContainer() {
  const {
    step,
    selectMeal,
    selectSnack,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    addSuggestedMeal,
    startNewConversation,
    snackResult,
  } = useAssistantActions()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending, snackResult])

  const lastAssistantIndex = [...messages].reverse().findIndex((message) => message.role === 'assistant')
  const lastAssistantMessage = lastAssistantIndex !== -1
    ? messages[messages.length - 1 - lastAssistantIndex]
    : undefined

  const suggestedMeals = lastAssistantMessage?.suggestedMeals
  const hasSuggestedMeals = suggestedMeals && suggestedMeals.length > 0

  return (
    <div className="relative flex h-full flex-col justify-between gap-3 sm:gap-4">
      {step !== 'choose' && (
        <button
          type="button"
          onClick={startNewConversation}
          className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-red-700 cursor-pointer"
        >
          <Plus size={16} />
          Nova conversa
        </button>
      )}

      <div className="flex-1 overflow-y-auto px-1 py-2 scrollbar-hide">
        <div className="mx-auto max-w-3xl space-y-6 pt-14">
          {step === 'choose' && <AssistantWelcome />}

          {messages.map((message, index) => {
            const isLastAssistant = message.role === 'assistant' && messages.slice(index + 1).every((m) => m.role !== 'assistant')

            if (message.role === 'user') {
              return <UserChatMessage key={message.id} content={message.content} />
            }

            return (
              <AssistantResponse key={message.id} content={message.content} contentKey={message.id}>
                {isLastAssistant && hasSuggestedMeals && (
                  <SuggestedMealCards meals={suggestedMeals ?? []} />
                )}
                {isLastAssistant && step === 'snack' && snackResult && (
                  <SnackSuggestions
                    remaining={snackResult.remaining}
                    options={snackResult.options}
                    onAdd={(meal) => addSuggestedMeal({ mealType: meal.mealType as AddSuggestedMealData['mealType'], mealName: meal.name })}
                    isAdding={isPending}
                  />
                )}
              </AssistantResponse>
            )
          })}

          {step === 'meal' && !isPending && !hasSuggestedMeals && (
            <AssistantResponse content="Me conta o que você comeu que eu registro pra você." contentKey="meal-prompt" />
          )}

          {step === 'snack' && !isPending && !snackResult && (
            <AssistantResponse content="Qual tipo de refeição você quer sugerir?" contentKey="snack-prompt" />
          )}

          {isPending && step !== 'choose' && <AssistantTyping />}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-3">
        {step === 'choose' && (
          <AssistantIntentPills onSelectMeal={selectMeal} onSelectSnack={selectSnack} />
        )}
        {step === 'meal' && <ChatInput onSubmit={submitMeal} isPending={isPending} />}
        {step === 'snack' && <SnackInput onSubmit={submitSnack} isPending={isPending} />}

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          A IA pode cometer erros. Sempre revise as sugestões antes de adicionar.
        </p>
      </div>
    </div>
  )
}
