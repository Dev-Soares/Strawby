import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease, delay },
})

const ArrowDesktop = () => (
  <div className="hidden shrink-0 items-center justify-center pt-20 text-red-600 md:flex lg:pt-22 dark:text-red-500">
    <ArrowRight size={44} strokeWidth={3.2} />
  </div>
)

const ArrowMobile = () => (
  <div className="flex justify-center py-5 text-red-600 md:hidden dark:text-red-500">
    <ArrowDown size={38} strokeWidth={3.2} />
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
    description: 'Calorias, macros e sua pontuação do dia calculados na hora.',
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
      className="bg-white py-16 transition-colors duration-300 sm:py-24 lg:py-28 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* Cabeçalho */}
        <motion.div className="mb-16 max-w-xl text-left sm:mb-24" {...fadeUp(0)}>
          <h2 className="font-display text-[42px] font-black tracking-tighter leading-[0.94] text-neutral-950 sm:text-[54px] lg:text-[62px] dark:text-neutral-100">
            Simples do começo <span className="text-red-600">ao fim.</span>
          </h2>
          <p className="mt-3 text-sm font-medium text-neutral-600 sm:text-lg dark:text-neutral-400">
            Acompanhe seu dia em poucos cliques.
          </p>
        </motion.div>

        {/* 3 passos no mesmo fundo contínuo */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between lg:px-4">
          {/* 1. Comeu */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.08)}>
            <div className="relative mb-4 flex h-44 w-44 items-center justify-center sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[0].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-3 font-display text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl dark:text-neutral-100">
              {steps[0].title}
            </h3>
            <p className="text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
              {steps[0].description}
            </p>
          </motion.div>

          <ArrowDesktop />
          <ArrowMobile />

          {/* 2. Registrou */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.18)}>
            <div className="relative mb-4 flex h-44 w-44 items-center justify-center sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[1].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-3 font-display text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl dark:text-neutral-100">
              {steps[1].title}
            </h3>
            <p className="text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
              {steps[1].description}
            </p>
          </motion.div>

          <ArrowDesktop />
          <ArrowMobile />

          {/* 3. A gente calcula */}
          <motion.div className="flex flex-1 flex-col items-center text-center max-w-[270px]" {...fadeUp(0.28)}>
            <div className="relative mb-4 flex h-44 w-44 items-center justify-center sm:h-48 sm:w-48">
              <StrawbyMascot
                action={steps[2].action}
                playback="loop"
                className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.12)]"
              />
            </div>
            <h3 className="mb-3 font-display text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl dark:text-neutral-100">
              {steps[2].title}
            </h3>
            <p className="text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
              {steps[2].description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
