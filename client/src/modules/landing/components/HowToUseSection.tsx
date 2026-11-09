import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease, delay },
})

/** Trilha pontilhada estática que liga um passo ao outro. */
const ConnectorDesktop = () => (
  <div className="hidden shrink-0 items-center gap-2.5 pt-20 md:flex lg:pt-22">
    <span className="h-2.5 w-2.5 rounded-full bg-red-200" />
    <span className="h-3.5 w-3.5 rounded-full bg-red-300" />
    <span className="h-4.5 w-4.5 rounded-full bg-red-400" />
    <ChevronRight size={38} strokeWidth={4} className="-ml-1 text-red-600" />
  </div>
)

const ConnectorMobile = () => (
  <div className="flex h-16 flex-col items-center justify-center gap-2 md:hidden">
    <span className="h-2.5 w-2.5 rounded-full bg-red-200" />
    <span className="h-3.5 w-3.5 rounded-full bg-red-300" />
    <span className="h-4.5 w-4.5 rounded-full bg-red-400" />
    <ChevronDown size={30} strokeWidth={4} className="-mt-1 text-red-600" />
  </div>
)

const steps = [
  {
    title: 'Comeu',
    description: 'Faça suas refeições normalmente, sem estresse ou fórmulas complicadas.',
    action: 'eating' as const,
  },
  {
    title: 'Registrou',
    description: 'Em poucos segundos no celular,Registre o que comeu no aplicativo.',
    action: 'phone' as const,
  },
  {
    title: 'A gente calcula',
    description: 'Calorias, nutrientes e sua pontuação do dia calculados na hora.',
    action: 'celebrate' as const,
  },
] as const

export default function HowToUseSection() {
  useEffect(() => {
    preloadMascotActions(['eating', 'phone', 'celebrate'])
  }, [])

  return (
    <section
      id="como-usar"
      className="bg-white py-12 transition-colors duration-300 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Cabeçalho */}
        <motion.div className="mb-10 max-w-xl text-left sm:mb-24" {...fadeUp(0)}>
          <h2 className="font-display text-[32px] font-black tracking-tighter leading-[0.94] text-neutral-950 sm:text-[54px] lg:text-[62px]">
            Simples do começo <span className="text-red-600">ao fim.</span>
          </h2>
          <p className="mt-3 text-[13px] font-medium text-neutral-600 sm:text-lg">
            Acompanhe seu dia em poucos cliques.
          </p>
        </motion.div>

        {/* 3 passos no mesmo fundo contínuo */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between lg:px-4">
          {/* 1. Comeu */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.08)}>
            <div className="relative mb-3 flex h-36 w-36 items-center justify-center sm:mb-4 sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[0].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-2 font-display text-xl font-black tracking-tight text-neutral-950 sm:mb-3 sm:text-3xl">
              {steps[0].title}
            </h3>
            <p className="text-[13px] font-medium leading-relaxed text-neutral-600 sm:text-sm">
              {steps[0].description}
            </p>
          </motion.div>

          <ConnectorDesktop />
          <ConnectorMobile />

          {/* 2. Registrou */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.18)}>
            <div className="relative mb-3 flex h-36 w-36 items-center justify-center sm:mb-4 sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[1].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-2 font-display text-xl font-black tracking-tight text-neutral-950 sm:mb-3 sm:text-3xl">
              {steps[1].title}
            </h3>
            <p className="text-[13px] font-medium leading-relaxed text-neutral-600 sm:text-sm">
              {steps[1].description}
            </p>
          </motion.div>

          <ConnectorDesktop />
          <ConnectorMobile />

          {/* 3. A gente calcula */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.28)}>
            <div className="relative mb-3 flex h-36 w-36 items-center justify-center sm:mb-4 sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[2].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-2 font-display text-xl font-black tracking-tight text-neutral-950 sm:mb-3 sm:text-3xl">
              {steps[2].title}
            </h3>
            <p className="text-[13px] font-medium leading-relaxed text-neutral-600 sm:text-sm">
              {steps[2].description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
