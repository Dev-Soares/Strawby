import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16">
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

          <motion.h1
            className="font-display font-black tracking-tighter leading-[0.88] text-balance text-[56px] md:text-[72px] lg:text-[84px] xl:text-[96px] mb-8"
            {...fadeUp(0.08)}
          >
            <span className="text-neutral-950">Domine cada </span>
            <span className="text-red-600">refeição.</span>
          </motion.h1>

          <motion.div
            className="w-14 h-0.75 bg-red-600 mb-8"
            {...fadeUp(0.22)}
          />

          <motion.p
            className="text-neutral-700 text-[19px] sm:text-[20px] leading-relaxed max-w-105 mb-10 font-medium"
            {...fadeUp(0.36)}
          >
            Rastreie calorias e macros com precisão. Entenda o que você come,
            alcance suas metas e transforme sua relação com a comida.
          </motion.p>

          <motion.div
            className="flex justify-center"
            {...fadeUp(0.5)}
          >
            <a
              href="/create-account"
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-150 flex items-center gap-2 text-[15px] cursor-pointer"
            >
              Começar agora
              <ArrowRight size={17} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none overflow-hidden select-none"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-black tracking-[-0.05em] leading-[0.8] whitespace-nowrap pr-[0.15em]"
              style={{
                fontSize: 'clamp(140px, 22vw, 360px)',
                WebkitTextStroke: '2px rgba(220, 38, 38, 0.5)',
                color: 'transparent',
              }}
            >
              STRAWBY ·
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
