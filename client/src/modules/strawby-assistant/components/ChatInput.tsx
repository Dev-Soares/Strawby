import { ArrowUp, Mic, MicOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { sendAssistantMessageSchema, type SendAssistantMessageData } from '../types/chat'
import { useSpeechRecognition } from '../../../shared/hooks/useSpeechRecognition'
import { useAudioVisualizer } from '../../../shared/hooks/useAudioVisualizer'
import AudioWaveform from './AudioWaveform'

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
    formState: { errors },
  } = useForm<SendAssistantMessageData>({
    resolver: zodResolver(sendAssistantMessageSchema),
  })

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
        <div className="flex min-h-[60px] sm:min-h-[56px] w-full items-center justify-center gap-3 rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 sm:px-5 py-3 sm:py-4 pr-24 sm:pr-24">
          <AudioWaveform bars={bars} />
          <span className="text-sm font-medium text-red-700 dark:text-red-400">Ouvindo...</span>
        </div>
      ) : (
        <textarea
          {...register('message')}
          rows={1}
          placeholder="Digite sua meta, preferências ou o que tem na geladeira..."
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submitMessage()
            }
          }}
          className="field-sizing-content min-h-[60px] sm:min-h-[56px] max-h-[200px] w-full resize-none rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 sm:py-4 pl-4 sm:pl-5 pr-24 sm:pr-24 text-sm text-neutral-950 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:focus:ring-red-600/40 transition-all duration-200 disabled:opacity-60"
        />
      )}

      <button
        type="button"
        onClick={toggle}
        disabled={isPending && !isListening}
        className={`absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          isListening
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
        }`}
        aria-label={isListening ? 'Parar de gravar' : 'Gravar mensagem de voz'}
      >
        {isListening ? <MicOff size={16} className="size-4 sm:size-5" /> : <Mic size={16} className="size-4 sm:size-5" />}
      </button>

      <button
        type="submit"
        disabled={isPending || isListening}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Enviar mensagem"
      >
        <ArrowUp size={16} className="size-4 sm:size-5" />
      </button>

      {errors.message && (
        <p className="absolute -top-6 left-0 text-xs text-red-500">{errors.message.message}</p>
      )}
    </form>
  )
}
