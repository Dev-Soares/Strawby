import { CookingPotIcon, BowlSteamIcon, TrayIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { Step } from '../types/howItWorks'

const steps: Step[] = [
  {
    time: '08:23',
    icon: CookingPotIcon,
    title: 'Crie sua conta',
    description:
      'Cadastre-se em 30 segundos. Defina suas metas de calorias e macros de acordo com seus objetivos.',
    tag: 'uma vez só',
  },
  {
    time: '12:47',
    icon: BowlSteamIcon,
    title: 'Registre suas refeições',
    description:
      'Busque alimentos, escaneie o código de barras ou crie refeições personalizadas com um clique.',
    tag: 'cada refeição',
  },
  {
    time: '21:05',
    icon: TrayIcon,
    title: 'Evolua todo dia',
    description:
      'Veja seus relatórios, mantenha a sequência diária e alcance suas metas com consistência.',
    tag: 'todo dia',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mb-3">
            Como funciona
          </p>
          <h2 className="font-display text-[40px] md:text-[56px] font-black tracking-tighter text-neutral-950 leading-none">
            Simples assim.
          </h2>
        </motion.div>

        <div className="border-t border-neutral-200">
          {steps.map(({ time, icon: StepIcon, title, description, tag }, i) => (
            <motion.div
              key={time}
              className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16 py-10 border-b border-neutral-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.34, 1.05, 0.64, 1], delay: i * 0.1 }}
            >
              <div className="shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 w-full md:w-52">
                <StepIcon size={28} weight="duotone" className="text-neutral-400" />
                <span className="font-display font-black text-[52px] md:text-[64px] leading-none tracking-tighter text-red-600 tabular-nums">
                  {time}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="font-display text-xl font-black text-neutral-950 tracking-tight">{title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-neutral-200 rounded-full px-3 py-1 leading-none">
                    {tag}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
