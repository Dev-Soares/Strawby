import { ArrowUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendAssistantMessageSchema, type SendAssistantMessageData } from '../types/chat'

interface ChatInputProps {
  onSubmit: (data: SendAssistantMessageData) => void
  isPending: boolean
}

export default function ChatInput({ onSubmit, isPending }: ChatInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendAssistantMessageData>({
    resolver: zodResolver(sendAssistantMessageSchema),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data)
        reset()
      })}
      className="relative"
    >
      <textarea
        {...register('message')}
        rows={1}
        placeholder="Digite sua meta, preferências ou o que tem na geladeira..."
        disabled={isPending}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit((data) => {
              onSubmit(data)
              reset()
            })()
          }
        }}
        className="min-h-[56px] w-full resize-none rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-4 pl-5 pr-14 text-sm text-neutral-950 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:focus:ring-red-600/40 transition-all duration-200 disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={isPending}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Enviar mensagem"
      >
        <ArrowUp size={18} />
      </button>

      {errors.message && (
        <p className="absolute -top-6 left-0 text-xs text-red-500">{errors.message.message}</p>
      )}
    </form>
  )
}
