import { ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const features = [
  'Rastreie calorias, proteína, carbo e gordura em segundos',
  'Base com mais de 10.000 alimentos catalogados',
  'Histórico e relatórios de progresso sem complicação',
  'Gratuito — sem planos, sem limites, sem pegadinha',
]

export default function CTA() {
  return (
    <section className="relative bg-white py-32 overflow-hidden">

      {/* Barras degradê */}
      <div className="hidden lg:flex absolute left-0 top-0 bottom-0">
        <div className="w-14 bg-red-600" />
        <div className="w-12 bg-red-600/45" />
        <div className="w-10 bg-red-600/22" />
        <div className="w-8 bg-red-600/10" />
        <div className="w-6 bg-red-600/5" />
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:pl-36 lg:pr-16 py-8">

        {/* Brand */}
        <motion.a
          href="/"
          className="inline-flex items-center gap-2.5 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img src="/logo.png" alt="Strawby" className="w-16 h-16 object-contain" />
          <span
            className="text-neutral-950 text-3xl tracking-tighter"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800 }}
          >
            Strawby
          </span>
        </motion.a>

        {/* Headline */}
        <div className="mb-16">
          <motion.h2
            className="text-[52px] md:text-[68px] lg:text-[84px] font-black tracking-tighter text-neutral-950 leading-none"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1], delay: 0.05 }}
          >
            Pare de adivinhar.
          </motion.h2>
          <motion.h2
            className="text-[52px] md:text-[68px] lg:text-[84px] font-black tracking-tighter text-red-600 leading-none"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1], delay: 0.15 }}
          >
            Comece a saber.
          </motion.h2>
        </div>

        {/* Divider */}
        <motion.div
          className="w-full h-px bg-neutral-200 mb-14"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          <ul className="space-y-5">
            {features.map((f, i) => (
              <motion.li
                key={f}
                className="flex items-start gap-3.5"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.25 + i * 0.08 }}
              >
                <CheckCircle size={17} weight="fill" className="text-red-600 mt-0.5 shrink-0" />
                <span className="text-neutral-600 text-[15px] leading-relaxed">{f}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          >
            <p className="text-neutral-500 text-[17px] leading-relaxed mb-8">
              Entenda o que você come, veja seus macros em tempo real e tome decisões reais sobre a sua alimentação.
            </p>

            <a
              href="/create-account"
              className="group inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-[15px] cursor-pointer"
            >
              Criar minha conta
              <ArrowRight
                size={17}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </a>

            <p className="text-neutral-400 text-[13px] mt-4 font-medium">
              Gratuito. Sem cartão de crédito.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
