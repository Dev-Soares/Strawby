import { useCallback, useEffect, useRef, useState } from 'react'

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      setError('Seu navegador não suporta reconhecimento de voz')
      return
    }

    setError(null)
    setTranscript('')

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Permissão de microfone negada')
      } else if (event.error === 'no-speech') {
        setError('Nenhuma fala detectada')
      } else {
        setError('Erro ao reconhecer a fala')
      }
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1]
      if (lastResult?.isFinal) {
        const result = lastResult[0]?.transcript
        if (result) setTranscript((prev) => (prev ? `${prev} ${result}` : result))
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const toggle = useCallback(() => {
    if (isListening) stop()
    else start()
  }, [isListening, start, stop])

  const resetTranscript = useCallback(() => setTranscript(''), [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    isListening,
    transcript,
    error,
    start,
    stop,
    toggle,
    resetTranscript,
  }
}
