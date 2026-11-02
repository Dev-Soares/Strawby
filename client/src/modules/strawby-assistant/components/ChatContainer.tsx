import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAssistantChat } from '../hooks/useAssistantChat'
import AssistantPresentation from './AssistantPresentation'
import ChatInput from './ChatInput'
import SuggestedMealCards from './SuggestedMealCards'

export default function ChatContainer() {
  const { messages, sendMessage, isPending } = useAssistantChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  const userMessages = messages.filter((message) => message.role === 'user')
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant')

  const suggestedMeals = lastAssistantMessage?.suggestedMeals
  const hasSuggestedMeals = suggestedMeals && suggestedMeals.length > 0

  const getPresentationProps = () => {
    if (messages.length === 0) return { state: 'welcome' as const }
    if (isPending || !lastAssistantMessage) return { state: 'typing' as const }
    if (hasSuggestedMeals) {
      return { state: 'response' as const, response: 'Pronto! Refeição criada! Algo mais que posso te ajudar?' }
    }
    return { state: 'response' as const, response: lastAssistantMessage.content }
  }

  const presentation = getPresentationProps()

  return (
    <div className="relative flex h-full flex-col justify-between gap-3 sm:gap-4">
      <div className="flex-1 overflow-y-auto px-1 py-2 scrollbar-hide">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mt-14">
            <AssistantPresentation {...presentation} />
          </div>

          {hasSuggestedMeals ? (
            <SuggestedMealCards meals={suggestedMeals ?? []} />
          ) : (
            userMessages.map((message) => (
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
            ))
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <ChatInput onSubmit={sendMessage} isPending={isPending} />
        <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
          A IA pode cometer erros. Sempre revise as sugestões antes de adicionar.
        </p>
      </div>
    </div>
  )
}
