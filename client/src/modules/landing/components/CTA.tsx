import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease, delay },
})

export default function CTA() {
  useEffect(() => {
    preloadMascotActions(['inviting'])
  }, [])

  return (
    <section className="relative overflow-hidden bg-white pt-20 sm:pt-28 lg:pt-36 transition-colors duration-300 dark:bg-neutral-950">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 pb-16 sm:pb-20 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">

          {/* Lado Esquerdo */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h2
              className="font-display text-[44px] sm:text-[56px] lg:text-[68px] font-black tracking-tighter leading-[0.92] text-neutral-950 dark:text-neutral-100"
              {...fadeUp(0)}
            >
              Que tal começar <span className="text-red-600">hoje?</span>
            </motion.h2>

            <motion.p
              className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400"
              {...fadeUp(0.1)}
            >
              Pequenos passos fazem a diferença. Comece a cuidar da sua alimentação de um jeito mais simples e leve.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
              {...fadeUp(0.2)}
            >
              <a
                href="/app/create-account"
                className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-red-600 px-8 py-4.5 text-base font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 hover:-translate-y-0.5 active:translate-y-0.5 active:bg-red-800 transition-all duration-200 cursor-pointer"
              >
                <span>Começar agora</span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Gratuito para começar. Sem complicação.
              </span>
            </motion.div>
          </div>

          {/* Lado Direito: mascote */}
          <div className="relative flex min-h-80 justify-center lg:justify-start">
            <div className="relative z-10 flex items-end">
              <motion.div
                className="relative z-10 h-52 w-52 sm:h-60 sm:w-60 lg:h-72 lg:w-72 shrink-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, ease }}
              >
                <StrawbyMascot
                  action="inviting"
                  playback="loop"
                  className="h-full w-full drop-shadow-[0_20px_32px_rgba(220,38,38,0.14)]"
                />
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Transição wave para o footer */}
      <div aria-hidden className="relative -mb-1 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 sm:h-36 lg:h-48 text-red-600 block"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,85 C 180,25 360,20 540,65 C 720,110 860,150 1060,145 C 1240,140 1340,55 1440,75 L 1440,180 L 0,180 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}
