import { useEffect, useRef, useState } from 'react'
import {
  MASCOT_ACTION_DURATION_MS,
  MASCOT_ACTION_END_SRC,
  MASCOT_ACTION_SRC,
} from '../config/mascotActions'
import type { MascotAction } from '../types/mascotAction'

interface StrawbyMascotProps {
  /** Qual animação tocar. */
  action: MascotAction
  /** `false` trava no último frame quando a animação termina. Padrão: repete. */
  loop?: boolean
  /** Chamado uma vez quando a animação termina (só com `loop={false}`). */
  onComplete?: () => void
  /** Tamanho e posicionamento — o componente só traz `object-contain`. */
  className?: string
}

export default function StrawbyMascot({
  action,
  loop = true,
  onComplete,
  className = 'h-40 w-40',
}: StrawbyMascotProps) {
  const [isFinished, setIsFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // trocar de ação (ou voltar a repetir) recomeça a contagem do fim
  const [playing, setPlaying] = useState({ action, loop })
  if (playing.action !== action || playing.loop !== loop) {
    setPlaying({ action, loop })
    setIsFinished(false)
    setIsPlaying(false)
  }

  // guardado em ref para um `onComplete` inline não reiniciar a animação
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // o still do último frame precisa estar em cache antes da troca, senão a
  // animação pisca no fim enquanto o browser busca a imagem
  useEffect(() => {
    if (loop) return
    const preload = new Image()
    preload.src = MASCOT_ACTION_END_SRC[action]
  }, [action, loop])

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

  const src = isFinished ? MASCOT_ACTION_END_SRC[action] : MASCOT_ACTION_SRC[action]

  return (
    <img
      // remontar o <img> faz o WebP recomeçar do frame 0 ao trocar de ação
      key={`${action}-${isFinished}`}
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      onLoad={() => setIsPlaying(true)}
      className={`select-none object-contain ${className}`}
    />
  )
}
