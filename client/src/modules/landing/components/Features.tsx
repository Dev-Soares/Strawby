import { CheckIcon, XIcon, WarningIcon, ArrowUpIcon, ArrowDownIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

// ─── Shared ───────────────────────────────────────────────────────────────────

function Dot({ status }: { status: 'good' | 'warn' | 'bad' | 'empty' }) {
  if (status === 'good') return (
    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
      <CheckIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  if (status === 'warn') return (
    <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
      <WarningIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  if (status === 'bad') return (
    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
      <XIcon size={8} weight="bold" className="text-white" />
    </div>
  )
  return <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
}

// ─── Patient preview ──────────────────────────────────────────────────────────

const week = ['good', 'warn', 'bad', 'good', 'empty', 'empty', 'empty'] as const
const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
const macros = [
  { label: 'Proteína', value: 82,  max: 150, color: '#f59e0b' },
  { label: 'Carbos',   value: 200, max: 280, color: '#3b82f6' },
  { label: 'Gordura',  value: 48,  max: 73,  color: '#a855f7' },
]

function PatientPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-5 transition-colors duration-300">
      <div className="grid grid-cols-7 gap-1.5">
        {week.map((status, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.04 }}
            className={`flex flex-col items-center gap-2 rounded-xl py-3 ${
              i === 3 ? 'bg-red-600' : 'bg-neutral-50 dark:bg-neutral-800/50'
            } transition-colors duration-300`}
          >
            <span className={`text-[9px] font-bold tracking-wider ${i === 3 ? 'text-white/60' : 'text-neutral-400'}`}>
              {days[i]}
            </span>
            <Dot status={status} />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums transition-colors duration-300">1.310</span>
          <span className="text-xs font-bold text-neutral-400">/ 2.200 kcal</span>
        </div>
        {macros.map((m, i) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 transition-colors duration-300">{m.label}</span>
              <span className="text-[10px] font-black tabular-nums" style={{ color: m.color }}>{m.value}g</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden transition-colors duration-300">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(m.value / m.max) * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.34, 1.05, 0.64, 1], delay: 0.2 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Nutritionist preview ─────────────────────────────────────────────────────

const patients = [
  { initials: 'AL', name: 'Ana Lima',    score: 87,  trend: 'up',   label: 'em dia',    scores: [72, 58, 91, 87, 0, 0, 0] },
  { initials: 'JM', name: 'João Mendes', score: 62,  trend: 'down', label: 'irregular', scores: [80, 40, 60, 50, 0, 0, 0] },
  { initials: 'CS', name: 'Carla Souza', score: 100, trend: 'up',   label: 'perfeito',  scores: [95, 100, 90, 100, 0, 0, 0] },
  { initials: 'PC', name: 'Pedro Costa', score: 24,  trend: 'down', label: 'ausente',   scores: [30, 20, 0, 24, 0, 0, 0] },
]

function NutritionistPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-2 transition-colors duration-300">
      {patients.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.35, delay: 0.08 + i * 0.07 }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 transition-colors duration-300"
        >
          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-black text-white">{p.initials}</span>
          </div>

          <span className="text-[12px] font-bold text-neutral-900 dark:text-neutral-100 flex-1 truncate transition-colors duration-300">{p.name}</span>

          <div className="flex items-end gap-0.5 h-5 shrink-0">
            {p.scores.map((s, si) => (
              <div
                key={si}
                className={`w-1.5 rounded-sm ${s === 0 ? 'bg-neutral-200 dark:bg-neutral-700' : s >= 80 ? 'bg-emerald-400' : s >= 60 ? 'bg-amber-400' : 'bg-red-400'} transition-colors duration-300`}
                style={{ height: s > 0 ? `${Math.max(20, s)}%` : '20%' }}
              />
            ))}
          </div>

          <div className={`flex items-center gap-0.5 shrink-0 ${p.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {p.trend === 'up' ? <ArrowUpIcon size={9} weight="bold" /> : <ArrowDownIcon size={9} weight="bold" />}
            <span className="text-[9px] font-black">{p.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

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
