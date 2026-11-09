import { motion } from 'framer-motion'
import type { TourRect } from '../hooks/useTourAnchor'

interface TourSpotlightProps {
  /** Caixa a destacar. `null` escurece a tela inteira. */
  rect: TourRect | null
}

const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const

/**
 * O escuro do tutorial, com um buraco no alvo.
 *
 * A sombra gigante é o que pinta o resto da tela: assim o recorte acompanha o
 * elemento sem precisar de máscara em SVG, e a aba de verdade continua à vista.
 */
export default function TourSpotlight({ rect }: TourSpotlightProps) {
  // as duas versões precisam de `key`: sem ela o React reaproveita o mesmo nó e
  // o escuro de tela cheia herda o top/left/width/height animado do recorte
  if (!rect) {
    return (
      <motion.div
        key="full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-neutral-950/70"
      />
    )
  }

  return (
    <motion.div
      key="cutout"
      initial={false}
      animate={{
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }}
      transition={SPRING}
      className="pointer-events-none absolute rounded-2xl ring-3 ring-red-500/80 shadow-[0_0_0_9999px_rgba(10,10,10,0.62)]"
    />
  )
}
