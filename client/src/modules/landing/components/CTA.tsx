import { ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="relative bg-white pt-20 lg:pt-24 pb-28 lg:pb-32 overflow-hidden">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 sm:-right-32 lg:-right-40 bottom-[-10%] flex select-none"
        initial={{ opacity: 0, rotate: -18, scale: 0.85 }}
        whileInView={{ opacity: 0.9, rotate: -12, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <img
          src="/logo.png"
          alt=""
          className="select-none"
          style={{ width: 'clamp(360px, 50vw, 720px)', height: 'auto' }}
        />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-10">
          <motion.h2
            className="font-display text-[56px] sm:text-[80px] lg:text-[120px] font-black tracking-[-0.04em] text-neutral-950 leading-[0.88]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.34, 1.05, 0.64, 1], delay: 0.05 }}
          >
            Pare de
            <br />
            adivinhar.
          </motion.h2>
          <motion.h2
            className="font-display text-[56px] sm:text-[80px] lg:text-[120px] font-black tracking-[-0.04em] leading-[0.88] mt-2"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.34, 1.05, 0.64, 1], delay: 0.18 }}
          >
            <span className="text-neutral-950">Comece a </span>
            <span className="relative inline-block">
              <span className="relative z-10 text-white px-4">saber.</span>
              <motion.span
                className="absolute inset-0 bg-red-600 -skew-x-6 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1], delay: 0.45 }}
              />
            </span>
          </motion.h2>
        </div>

        <motion.div
          className="flex flex-col items-start max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.35 }}
        >
          <p className="text-neutral-600 text-[20px] sm:text-[22px] leading-relaxed mb-10">
            Entenda o que você come, veja seus macros em tempo real e tome decisões reais sobre a sua alimentação.
          </p>

          <a
            href="/create-account"
            className="group relative inline-flex items-center hover:translate-y-[-2px] transition-all  gap-3 bg-red-600 hover:bg-red-700 text-white font-bold pl-7 pr-5 py-5 rounded-full duration-300 text-[15px] cursor-pointer"
          >
            <span className="tracking-tight">Criar minha conta</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-red-600 transition-colors duration-300">
              <ArrowRight
                size={16}
                weight="bold"
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
