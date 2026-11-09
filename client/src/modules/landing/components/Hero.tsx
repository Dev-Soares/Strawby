import type { MouseEvent } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import HeroMascot from './HeroMascot'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

// Scroll suave explicito: o CSS global nao usa scroll-behavior: smooth
// (ver comentario em index.css) e o href fica como fallback sem JS.
const scrollToShowcase = (event: MouseEvent<HTMLAnchorElement>) => {
  const target = document.getElementById('conheca')
  if (!target) return

  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const Hero = () => {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-20 pb-8 sm:min-h-[calc(100vh-80px)] sm:pt-32 sm:pb-16">
      <div className="flex-1 flex items-center px-6">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-5 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

          <motion.div
            className="relative z-10 order-1"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <HeroMascot />
          </motion.div>

          <div className="relative z-10 order-2 flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">

            <motion.h1
              className="w-full max-w-[500px] font-display font-black tracking-tighter leading-[0.95] text-balance text-[clamp(30px,8.6vw,40px)] mb-3 sm:leading-[0.92] sm:text-[52px] sm:mb-4 lg:text-[58px] xl:text-[64px]"
              {...fadeUp(0.08)}
            >
              <span className="text-neutral-950 transition-colors duration-300">
                Controlar{' '}
              </span>
              <span className="text-red-600">sua alimentação</span>
              <span className="text-neutral-950 transition-colors duration-300">
                {' '}
                não deveria ser um problema.
              </span>
            </motion.h1>

            <motion.p
              className="text-neutral-700 text-[16px] sm:text-[20px] leading-relaxed max-w-105 mb-6 sm:mb-9 font-medium transition-colors duration-300"
              {...fadeUp(0.36)}
            >
              Conte o que comeu por texto ou voz. O Strawby calcula as calorias,
              acompanha seus nutrientes e mostra como foi o seu dia.
            </motion.p>

            <motion.div
              className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center lg:justify-start"
              {...fadeUp(0.5)}
            >
              <a
                href="/app/create-account"
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-red-600 px-8 py-4 text-[15px] font-semibold text-white transition-colors duration-150 hover:border-red-700 hover:bg-red-700 active:border-red-800 active:bg-red-800 cursor-pointer"
              >
                Experimentar grátis
                <ArrowRight size={17} />
              </a>

              <a
                href="#conheca"
                onClick={scrollToShowcase}
                className="group flex items-center justify-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-8 py-4 text-[15px] font-semibold text-neutral-700 transition-colors duration-150 hover:border-stone-300 hover:bg-stone-50 hover:text-neutral-950 cursor-pointer"
              >
                Conhecer o aplicativo
                <ChevronDown
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
