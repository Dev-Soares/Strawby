import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import HeroMascot from './HeroMascot'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center px-6 pt-28 pb-10 sm:pt-32">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

          <motion.div
            className="relative z-10 order-1"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <HeroMascot />
          </motion.div>

          <div className="relative z-10 order-2 flex flex-col items-center text-center lg:items-start lg:text-left">

            <motion.h1
              className="font-display font-black tracking-tighter leading-[0.92] text-balance text-[42px] sm:text-[54px] lg:text-[62px] xl:text-[68px] mb-4"
              {...fadeUp(0.08)}
            >
              <span className="text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
                Controlar{' '}
              </span>
              <span className="text-red-600">sua alimentação</span>
              <span className="text-neutral-950 dark:text-neutral-100 transition-colors duration-300">
                {' '}
                não deveria ser um problema.
              </span>
            </motion.h1>

            <motion.p
              className="text-neutral-700 dark:text-neutral-400 text-[18px] sm:text-[20px] leading-relaxed max-w-105 mb-9 font-medium transition-colors duration-300"
              {...fadeUp(0.36)}
            >
              Comeu, registrou, e a gente calcula. Simples assim.
            </motion.p>

            <motion.div
              className="flex flex-col items-center lg:items-start"
              {...fadeUp(0.5)}
            >
              <a
                href="/app/create-account"
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-150 flex items-center gap-2 text-[15px] cursor-pointer"
              >
                Começar agora
                <ArrowRight size={17} />
              </a>
            </motion.div>
          </div>
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
              className="font-display font-black tracking-[-0.05em] leading-[0.8] whitespace-nowrap pr-[0.15em] text-[clamp(72px,11vw,160px)] text-transparent [-webkit-text-stroke:1.5px_rgba(220,38,38,0.3)]"
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
