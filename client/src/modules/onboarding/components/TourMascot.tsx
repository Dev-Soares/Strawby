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

const SPRING = { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 } as const

/**
 * O mascote conduzindo o tutorial.
 *
 * Ele abre e fecha dentro da bolinha do assistente, nas coordenadas exatas do
 * `AssistantLauncher` (o botão real fica atrás do escuro), e no meio do caminho
 * sai da moldura para encostar em cada aba.
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
    <motion.div
      initial={false}
      animate={{
        left: layout.left,
        top: layout.top,
        width: layout.size,
        height: layout.size,
      }}
      transition={SPRING}
      className="pointer-events-none absolute flex items-center justify-center"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDocked ? (
          <motion.div
            key="docked"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="free"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <StrawbyMascot
              key={animationKey}
              action={action}
              playback={playback}
              className="h-full w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
