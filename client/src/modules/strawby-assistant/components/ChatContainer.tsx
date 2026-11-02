import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAssistantActions } from '../hooks/useAssistantActions'
import AssistantPresentation from './AssistantPresentation'
import ChatInput from './ChatInput'
import SnackInput from './SnackInput'
import SuggestedMealCards from './SuggestedMealCards'
import SnackSuggestions from './SnackSuggestions'
import AssistantIntentPills from './AssistantIntentPills'

export default function ChatContainer() {
  const {
    step,
    selectMeal,
    selectSnack,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    startNewConversation,
    snackResult,
  } = useAssistantActions()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending, snackResult])

  const userMessages = messages.filter((message) => message.role === 'user')
  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')

  const suggestedMeals = lastAssistantMessage?.suggestedMeals
  const hasSuggestedMeals = suggestedMeals && suggestedMeals.length > 0

  const getPresentationProps = () => {
    if (step === 'choose') return { state: 'welcome' as const }
    if (isPending) return { state: 'typing' as const }
    if (step === 'meal' && !lastAssistantMessage) {
      return { state: 'response' as const, response: 'Me conta o que você comeu que eu registro pra você.' }
    }
    if (step === 'snack' && !snackResult) {
      return { state: 'response' as const, response: 'Qual tipo de refeição você quer sugerir?' }
    }
    if (!lastAssistantMessage) return { state: 'typing' as const }
    if (hasSuggestedMeals) {
      return { state: 'response' as const, response: 'Pronto! Refeição criada! Algo mais que posso te ajudar?' }
    }
    return { state: 'response' as const, response: lastAssistantMessage.content }
  }

  const presentation = getPresentationProps()

  const result = (() => {
    if (step === 'snack' && snackResult) {
      return <SnackSuggestions remaining={snackResult.remaining} options={snackResult.options} />
    }

    if (hasSuggestedMeals) {
      return <SuggestedMealCards meals={suggestedMeals ?? []} />
    }

    return null
  })()

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
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mt-14">
            <AssistantPresentation {...presentation} />
          </div>

          {result ?? userMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl bg-neutral-100 px-5 py-3.5 text-[15px] leading-relaxed text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                {message.content}
              </div>
            </motion.div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-3">
        {step === 'choose' ? (
          <AssistantIntentPills onSelectMeal={selectMeal} onSelectSnack={selectSnack} />
        ) : (
          <>
            {step === 'meal' && <ChatInput onSubmit={submitMeal} isPending={isPending} />}
            {step === 'snack' && <SnackInput onSubmit={submitSnack} isPending={isPending} />}
          </>
        )}

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          A IA pode cometer erros. Sempre revise as sugestões antes de adicionar.
        </p>
      </div>
    </div>
  )
}
