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

  useEffect(() => {
    // o WebP só começa a tocar depois de decodificado — contar a partir da
    // montagem congelaria a animação no meio em cache frio
    if (loop || !isPlaying) return

    const timer = setTimeout(() => {
      setIsFinished(true)
      onCompleteRef.current?.()
    }, MASCOT_ACTION_DURATION_MS[action])

    return () => clearTimeout(timer)
  }, [action, loop, isPlaying])

  // `once` congela no still; `settle` volta a animar o idle
  const isFrozen = isFinished && playback === 'once'

  // as duas camadas ficam montadas e só trocam de opacidade: remontar o <img>
  // no fim da animação deixava um frame vazio na tela — a piscada branca
  return (
    <div className={`relative select-none ${className}`}>
      <img
        // remontar faz o WebP recomeçar do frame 0 ao trocar de ação
        key={playingAction}
        src={MASCOT_ACTION_SRC[playingAction]}
        alt=""
        aria-hidden
        draggable={false}
        onLoad={() => setIsPlaying(true)}
        className={`absolute inset-0 h-full w-full object-contain ${
          isFrozen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {playback !== 'loop' && (
        <img
          src={MASCOT_ACTION_END_SRC[playingAction]}
          alt=""
          aria-hidden
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain ${
            isFrozen ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
