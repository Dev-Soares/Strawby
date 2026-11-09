import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'
import CtaMascotBubble from './CtaMascotBubble'

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
    <section className="relative overflow-hidden bg-white pt-20 sm:pt-28 lg:pt-36 transition-colors duration-300">
      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 pb-16 sm:pb-20 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-2 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">

          {/* Lado Esquerdo */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <motion.h2
              className="font-display text-[44px] sm:text-[56px] lg:text-[68px] font-black tracking-tighter leading-[0.92] text-neutral-950"
              {...fadeUp(0)}
            >
              Que tal começar <span className="text-red-600">agora?</span>
            </motion.h2>

            <motion.p
              className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-neutral-600 sm:text-xl"
              {...fadeUp(0.1)}
            >
              Pequenos passos fazem a diferença. Comece a cuidar da sua alimentação de um jeito mais simples e leve.
            </motion.p>

            <motion.div
              className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3"
              {...fadeUp(0.2)}
            >
              <a
                href="/app/create-account"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-2xl bg-red-600 px-8 py-4.5 text-base font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 hover:-translate-y-0.5 active:translate-y-0.5 active:bg-red-800 transition-all duration-200 cursor-pointer"
              >
                <span>Criar minha conta grátis</span>
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href="/app/login"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-stone-200 bg-white px-8 py-4 text-base font-bold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:text-neutral-950 active:translate-y-0.5 cursor-pointer"
              >
                Já tenho uma conta
              </a>

              <span className="mt-1.5 text-sm font-semibold text-neutral-600 sm:text-[15px]">
                Gratuito para começar. Sem complicação.
              </span>
            </motion.div>
          </div>

          {/* Lado Direito: mascote */}
          <div className="relative order-1 flex min-h-60 items-center justify-center sm:min-h-88 lg:order-2 lg:justify-start">
            <div className="relative z-10 flex items-end">
              <motion.div
                className="relative z-10 h-56 w-56 sm:h-64 sm:w-64 lg:h-76 lg:w-76 xl:h-80 xl:w-80 shrink-0"
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

                <CtaMascotBubble />
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
