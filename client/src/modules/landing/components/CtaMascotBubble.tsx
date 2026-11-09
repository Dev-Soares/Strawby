import { motion } from 'framer-motion'

const ease = [0.34, 1.05, 0.64, 1] as const

/** Balão de fala do mascote na CTA final — posiciona-se sozinho sobre ele. */
const CtaMascotBubble = () => {
  return (
    <motion.div
      className="absolute -top-12 left-1/2 z-20 w-max max-w-60 -translate-x-[38%] lg:-top-6 lg:left-[55%] lg:max-w-64 lg:translate-x-0 xl:left-[58%] xl:max-w-72"
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease, delay: 0.45 }}
    >
      <motion.div
        className="relative rounded-3xl border border-neutral-200/80 bg-white px-6 py-5 shadow-xl shadow-neutral-900/10"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
      >
        <p className="text-base font-bold leading-snug tracking-tight text-neutral-900 lg:text-lg">
          Bora registrar sua{' '}
          <span className="text-red-600">primeira refeição?</span>
        </p>

        {/* Ponta do balão: quadrado girado com as bordas de baixo e da direita visíveis */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-xs border-b border-r border-neutral-200/80 bg-white lg:left-6 lg:translate-x-0"
        />
      </motion.div>
    </motion.div>
  )
}

export default CtaMascotBubble
