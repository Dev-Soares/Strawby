import { useEffect, useRef, useState } from 'react'
import {
  MASCOT_ACTION_DURATION_MS,
  MASCOT_ACTION_END_SRC,
  MASCOT_ACTION_SRC,
} from '@/shared/config/mascotActions'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'

interface StrawbyMascotProps {
  /** Qual animação tocar. */
  action: MascotAction
  /** Como a animação termina. Padrão: repete para sempre. */
  playback?: MascotPlayback
  /** Chamado uma vez quando a animação termina (não dispara em `loop`). */
  onComplete?: () => void
  /** Tamanho e posicionamento — o componente só traz `object-contain`. */
  className?: string
}

export default function StrawbyMascot({
  action,
  playback = 'loop',
  onComplete,
  className = 'h-40 w-40',
}: StrawbyMascotProps) {
  const [isFinished, setIsFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // trocar de ação (ou de playback) recomeça a contagem do fim
  const [current, setCurrent] = useState({ action, playback })
  if (current.action !== action || current.playback !== playback) {
    setCurrent({ action, playback })
    setIsFinished(false)
    setIsPlaying(false)
  }

  // `settle` continua em cena depois de terminar: volta pro idle em loop
  const hasSettled = playback === 'settle' && isFinished
  const playingAction = hasSettled ? 'idle' : action
  const loop = playback === 'loop' || hasSettled

  // guardado em ref para um `onComplete` inline não reiniciar a animação
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // o still do último frame precisa estar em cache antes da troca, senão a
  // animação pisca no fim enquanto o browser busca a imagem
  useEffect(() => {
    if (playback === 'loop') return
    const preload = new Image()
    preload.src = MASCOT_ACTION_END_SRC[action]
  }, [action, playback])

  useEffect(() => {
    // o WebP só começa a tocar depois de decodificado — contar a partir da
    // montagem congelaria a animação no meio em cache frio
    if (loop || !isPlaying) return

    const timer = setTimeout(() => {
      setIsFinished(true)
      onCompleteRef.current?.()
    }, MASCOT_ACTION_DURATION_MS)

    return () => clearTimeout(timer)
  }, [action, loop, isPlaying])

  // `once` congela no still; `settle` volta a animar o idle
  const isFrozen = isFinished && playback === 'once'
  const src = isFrozen ? MASCOT_ACTION_END_SRC[playingAction] : MASCOT_ACTION_SRC[playingAction]

  return (
    <img
      // remontar o <img> faz o WebP recomeçar do frame 0 ao trocar de ação
      key={`${playingAction}-${isFrozen}`}
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      onLoad={() => setIsPlaying(true)}
      className={`select-none object-contain ${className}`}
    />
  )
}
