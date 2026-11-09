import { ArrowUp, Mic, MicOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { sendAssistantMessageSchema, type SendAssistantMessageData } from '../types/chat'
import { useSpeechRecognition } from '../../../shared/hooks/useSpeechRecognition'
import { useAudioVisualizer } from '../../../shared/hooks/useAudioVisualizer'
import AudioWaveform from './AudioWaveform'

const MAX_MESSAGE_LENGTH = 500

interface ChatInputProps {
  onSubmit: (data: SendAssistantMessageData) => void
  isPending: boolean
}

export default function ChatInput({ onSubmit, isPending }: ChatInputProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SendAssistantMessageData>({
    resolver: zodResolver(sendAssistantMessageSchema),
  })

  const messageValue = watch('message', '')
  const characterCount = messageValue.length

  const { isListening, transcript, error, toggle, resetTranscript } = useSpeechRecognition()
  const { bars, start: startVisualizer, stop: stopVisualizer } = useAudioVisualizer()

  useEffect(() => {
    if (isListening) {
      void startVisualizer()
    } else {
      stopVisualizer()
    }
  }, [isListening, startVisualizer, stopVisualizer])

  useEffect(() => {
    if (transcript) {
      setValue('message', transcript, { shouldValidate: true })
      resetTranscript()
    }
  }, [transcript, setValue, resetTranscript])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const submitMessage = handleSubmit((data) => {
    onSubmit(data)
    reset()
  })

  return (
    <form onSubmit={submitMessage} className="relative">
      {isListening ? (
        <div className="flex min-h-14 w-full items-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20 sm:px-5 sm:py-4">
          <AudioWaveform bars={bars} />
          <span className="flex-1 text-sm font-medium text-red-700 dark:text-red-400">Ouvindo...</span>
          <button
            type="button"
            onClick={toggle}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3 text-xs font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer"
            aria-label="Parar gravação"
          >
            <MicOff size={15} />
            <span>Parar</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-red-600/30 dark:focus-within:ring-red-600/40">
          <textarea
            {...register('message')}
            rows={1}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Digite sua meta, preferências ou o que tem na geladeira..."
            disabled={isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submitMessage()
              }
            }}
            className="field-sizing-content min-h-5 max-h-40 flex-1 resize-none bg-transparent border-0 p-0 text-sm text-neutral-950 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-0 disabled:opacity-60"
          />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggle}
              disabled={isPending && !isListening}
              className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
              }`}
              aria-label={isListening ? 'Parar de gravar' : 'Gravar mensagem de voz'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="submit"
              disabled={isPending || isListening}
              className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-1.5 flex items-center justify-end px-1">
        <span
          className={`text-xs transition-colors duration-200 ${
            characterCount >= MAX_MESSAGE_LENGTH
              ? 'text-red-500'
              : characterCount >= MAX_MESSAGE_LENGTH * 0.9
                ? 'text-amber-500'
                : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          {characterCount}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {errors.message && (
        <p className="absolute -top-6 left-0 text-xs text-red-500">{errors.message.message}</p>
      )}
    </form>
  )
}
