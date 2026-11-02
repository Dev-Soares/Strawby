import AssistantCharacter from './AssistantCharacter'

export default function AssistantTyping() {
  return (
    <div className="flex flex-col items-start gap-3">
      <AssistantCharacter />
      <div className="rounded-2xl rounded-bl-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 shadow-sm">
        <span className="flex items-center gap-2">
          Strawby está digitando
          <span className="flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.1s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
          </span>
        </span>
      </div>
    </div>
  )
}
