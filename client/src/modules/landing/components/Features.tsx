import { motion } from 'framer-motion'
import PatientPreview from './PatientPreview'
import NutritionistPreview from './NutritionistPreview'

const patientBullets = [
  'Registre refeições em segundos',
  'Macros em tempo real, dia a dia',
  'Sequência semanal sempre visível',
]

const nutritionistBullets = [
  'Todos os pacientes em uma tela',
  'Progresso semanal de cada um',
  'Planos alimentares personalizados',
]

export default function Features() {
  return (
    <section className="bg-stone-50 dark:bg-neutral-950 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">

        <motion.h2
          className="font-display text-[32px] sm:text-[44px] lg:text-[56px] font-black tracking-[-0.04em] text-neutral-950 dark:text-neutral-100 leading-[0.92] mb-20 sm:mb-24 transition-colors duration-300"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          O que está sendo<br />
          <span className="italic text-red-600">servido hoje.</span>
        </motion.h2>

        {/* Patient */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-20 sm:mb-28"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600 mb-3">Para pacientes</p>
            <h3 className="font-display text-[26px] sm:text-[32px] font-black tracking-[-0.02em] text-neutral-950 dark:text-neutral-100 leading-tight mb-4 transition-colors duration-300">
              Coma bem.<br />Veja a diferença.
            </h3>
            <ul className="flex flex-col gap-2.5">
              {patientBullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
                  <div className="w-1 h-1 rounded-full bg-red-600 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <PatientPreview />
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800 mb-20 sm:mb-28 transition-colors duration-300" />

        {/* Nutritionist */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <NutritionistPreview />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600 mb-3">Para nutricionistas</p>
            <h3 className="font-display text-[26px] sm:text-[32px] font-black tracking-[-0.02em] text-neutral-950 dark:text-neutral-100 leading-tight mb-4 transition-colors duration-300">
              Prescreva.<br />Acompanhe de perto.
            </h3>
            <ul className="flex flex-col gap-2.5">
              {nutritionistBullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-[13px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
                  <div className="w-1 h-1 rounded-full bg-red-600 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
