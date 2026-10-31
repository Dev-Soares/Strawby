import { useEffect, useRef } from 'react'
import { useAssistantChat } from '../hooks/useAssistantChat'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import ChatWelcome from './ChatWelcome'

export default function ChatContainer() {
  const { messages, sendMessage, isPending, addSuggestedMeal } = useAssistantChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending])

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-full flex-col justify-between gap-3 sm:gap-4">
      <div className="flex-1 overflow-y-auto px-1 py-2 scrollbar-hide">
        {!hasMessages ? (
          <ChatWelcome />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onAddMeal={addSuggestedMeal} />
            ))}
            {isPending && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 p-0.5">
                  <img
                    src="/mascot/mascot-smile.webp"
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="rounded-2xl rounded-bl-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                  Strawby está pensando...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
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
