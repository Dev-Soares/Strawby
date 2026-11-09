import { AnimatePresence, motion } from 'framer-motion'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'
import type { TourLayout } from '../hooks/useTourLayout'

interface TourMascotProps {
  layout: TourLayout['mascot']
  /** Ancorado = cópia do botão do assistente; solto = mascote inteiro. */
  isDocked: boolean
  /** Pulso vermelho do fecho: "é aqui que você me acha". */
  isPulsing?: boolean
  action: MascotAction
  playback: MascotPlayback
  animationKey: string
}

/** Sumiço e chegada: a troca inteira em ~0.5s. */
const POOF = { duration: 0.26, ease: 'easeOut' } as const

/** Clarão do splash — mesma classe nos dois, só o sentido muda. */
const SPLASH = 'absolute inset-0 rounded-full bg-white/25 blur-md'

/**
 * O mascote conduzindo o tutorial.
 *
 * Ele abre e fecha dentro da bolinha do assistente, nas coordenadas exatas do
 * `AssistantLauncher` (o botão real fica atrás do escuro), e no meio do caminho
 * sai da moldura para encostar em cada aba.
 *
 * Entre um passo e outro ele não atravessa a tela: estoura num splash onde
 * estava e volta a se formar em outro, já no ponto novo. O `mode="wait"` do
 * `AnimatePresence` é o que segura isso — o passo que sai leva as coordenadas
 * antigas congeladas no elemento dele, e o que entra só monta depois.
 *
 * São dois clarões porque um só não dá conta: o de chegada toca na montagem, e
 * o de saída fica estacionado invisível esperando o `exit`, que o abre com
 * keyframes de opacidade (é o que faz ele reacender partindo do zero).
 */
export default function TourMascot({
  layout,
  isDocked,
  isPulsing = false,
  action,
  playback,
  animationKey,
}: TourMascotProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={animationKey}
        style={{
          left: layout.left,
          top: layout.top,
          width: layout.size,
          height: layout.size,
        }}
        className="pointer-events-none absolute flex items-center justify-center"
      >
        <motion.span
          aria-hidden
          className={SPLASH}
          initial={{ scale: 0.35, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        <motion.span
          aria-hidden
          className={SPLASH}
          initial={{ scale: 0.35, opacity: 0 }}
          animate={{ scale: 0.35, opacity: 0 }}
          exit={{ scale: 1.6, opacity: [0.5, 0] }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: 1, scale: [0.55, 1.08, 1] }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={POOF}
        >
          {isDocked ? (
            <>
              {isPulsing && (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
              )}

              {/* o anel vermelho é do fecho; na abertura ele é a cópia fiel do
                  launcher, que usa anel branco */}
              <span
                className={`absolute inset-0 overflow-hidden rounded-full bg-white shadow-xl shadow-black/40 dark:bg-neutral-100 ${
                  isPulsing ? 'ring-4 ring-red-500' : 'ring-2 ring-white dark:ring-neutral-900'
                }`}
              >
                <img
                  src="/mascot/happy-framed.webp"
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="h-full w-full select-none"
                />
              </span>
            </>
          ) : (
            <StrawbyMascot
              action={action}
              playback={playback}
              className="absolute inset-0 h-full w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
