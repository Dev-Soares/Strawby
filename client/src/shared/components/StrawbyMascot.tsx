import { useEffect, useRef, useState } from 'react'
import {
  MASCOT_ACTION_DURATION_MS,
  MASCOT_ACTION_END_SRC,
  MASCOT_ACTION_SRC,
} from '@/shared/config/mascotActions'
import { preloadImage } from '@/shared/utils/preloadImage'
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

/**
 * Deixa a ação pronta pra pintar: arquivo inteiro baixado + primeiro frame
 * decodificado. Montar a <img> sem isso dá um frame vazio (decode assíncrono)
 * ou, pior, a animação tocando com o arquivo pela metade — o navegador começa
 * assim que os primeiros frames chegam e a contagem do fim sai de fase.
 */
const prepareAction = async (target: MascotAction): Promise<void> => {
  await preloadImage(MASCOT_ACTION_SRC[target])

  const image = new Image()
  image.src = MASCOT_ACTION_SRC[target]
  // decode pode rejeitar (ex.: EncodingError) — monta mesmo assim
  await image.decode().catch(() => undefined)
}

export default function StrawbyMascot({
  action,
  playback = 'loop',
  onComplete,
  className = 'h-40 w-40',
}: StrawbyMascotProps) {
  const [isFinished, setIsFinished] = useState(false)

  // trocar de ação (ou de playback) recomeça a contagem do fim
  const [current, setCurrent] = useState({ action, playback })
  if (current.action !== action || current.playback !== playback) {
    setCurrent({ action, playback })
    setIsFinished(false)
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

  /**
   * O que está de fato na tela. `live` corre atrás de `playingAction`, mas só
   * troca quando a ação nova está pronta — até lá a anterior continua tocando
   * (hold-last). Trocar na hora mostrava o still da pose final enquanto o
   * arquivo baixava: parecia que a animação começava, cortava pro início e
   * tocava de novo.
   *
   * `leaving` é a ação anterior, que fica montada embaixo da nova por um
   * instante: a <img> nova leva um frame pra pintar mesmo decodificada, e sem
   * nada por baixo esse frame é a piscada na troca.
   */
  const [frames, setFrames] = useState<{
    live: MascotAction | null
    leaving: MascotAction | null
  }>({ live: null, leaving: null })

  useEffect(() => {
    let isStale = false

    void prepareAction(playingAction).then(() => {
      if (isStale) return
      setFrames((prev) =>
        prev.live === playingAction ? prev : { live: playingAction, leaving: prev.live },
      )
    })

    return () => {
      isStale = true
    }
  }, [playingAction])

  // a camada velha sai de cena assim que a nova já pintou por cima
  useEffect(() => {
    if (!frames.leaving) return

    const timer = setTimeout(() => {
      setFrames((prev) => ({ ...prev, leaving: null }))
    }, 200)

    return () => clearTimeout(timer)
  }, [frames.leaving])

  // `settle` termina trocando pro idle: baixa e decodifica durante a animação,
  // senão a remontagem no fim cai num frame vazio — o corte bruto
  useEffect(() => {
    if (playback !== 'settle') return
    void prepareAction('idle')
  }, [playback])

  const isAnimating = frames.live === playingAction

  useEffect(() => {
    // só conta a partir do frame 0, que é quando a ação nova entra em cena
    if (loop || !isAnimating) return

    const timer = setTimeout(() => {
      setIsFinished(true)
      onCompleteRef.current?.()
    }, MASCOT_ACTION_DURATION_MS[action])

    return () => clearTimeout(timer)
  }, [action, loop, isAnimating])

  // `once` congela no still; `settle` volta a animar o idle
  const isFrozen = isFinished && playback === 'once'

  return (
    <div className={`relative select-none ${className}`}>
      {/* Still na base, sem fade: cobre o freeze de `once` e a montagem fria.
          No freeze é a pose final da ação; na montagem fria, a pose neutra da
          ação que vem aí — igual ao frame 0, então a entrada não pula.
          Ele só pode aparecer quando a camada animada não está em cena: os dois
          semi-transparentes ao mesmo tempo deixam o fundo vazar pelo mascote
          (a escurecida no dark mode). */}
      <img
        src={MASCOT_ACTION_END_SRC[frames.live ?? playingAction]}
        alt=""
        aria-hidden
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain ${
          isFrozen || !frames.live ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* `key` pelo nome da ação: quando `live` vira `leaving`, o elemento é o
          mesmo e a animação velha segue rodando embaixo — remontar aqui a
          jogaria de volta pro frame 0. A nova monta por cima já no frame 0. */}
      {[frames.leaving, frames.live]
        .filter((layer): layer is MascotAction => layer !== null)
        .map((layer) => (
          <img
            key={layer}
            src={MASCOT_ACTION_SRC[layer]}
            alt=""
            aria-hidden
            draggable={false}
            className={`absolute inset-0 h-full w-full object-contain ${
              isFrozen && layer === frames.live ? 'opacity-0' : 'opacity-100'
            }`}
          />
        ))}
    </div>
  )
}
