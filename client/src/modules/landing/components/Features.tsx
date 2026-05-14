import { CheckIcon, XIcon, WarningIcon, FireIcon, ForkKnifeIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const weekDays = [
  { day: 'SEG', date: 5, status: 'good' as const },
  { day: 'TER', date: 6, status: 'warn' as const },
  { day: 'QUA', date: 7, status: 'bad' as const },
  { day: 'QUI', date: 8, status: 'good' as const, today: true },
  { day: 'SEX', date: 9, status: 'neutral' as const },
  { day: 'SÁB', date: 10, status: 'neutral' as const },
  { day: 'DOM', date: 11, status: 'neutral' as const },
]

const macros = [
  { label: 'PROTEÍNA', value: 82, max: 150, color: '#f59e0b', bg: '#fef3c7' },
  { label: 'CARBOS', value: 145, max: 280, color: '#3b82f6', bg: '#dbeafe' },
  { label: 'GORDURA', value: 48, max: 73, color: '#a855f7', bg: '#f3e8ff' },
]

const searchResults = [
  { name: 'Arroz, integral, cozido', meta: 'TACO · 100g', kcal: 124, macros: { p: 2.6, c: 25.8, g: 1 }, tag: 'TACO' },
  { name: 'Arroz, tipo 1, cozido', meta: 'TACO · 100g', kcal: 128, macros: { p: 2.5, c: 28.1, g: 0.2 } },
  { name: 'Arroz, tipo 2, cozido', meta: 'TACO · 100g', kcal: 130, macros: { p: 2.5, c: 28.6, g: 0.3 } },
  { name: 'Arroz, parboilizado, cozido', meta: 'TACO · 100g', kcal: 124, macros: { p: 2.5, c: 25.9, g: 1 } },
]

function StatusMark({ status }: { status: 'good' | 'warn' | 'bad' | 'neutral' }) {
  if (status === 'good') return <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><CheckIcon size={9} weight="bold" className="text-white" /></div>
  if (status === 'warn') return <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center"><WarningIcon size={9} weight="bold" className="text-white" /></div>
  if (status === 'bad') return <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><XIcon size={9} weight="bold" className="text-white" /></div>
  return <div className="w-1 h-1 rounded-full bg-neutral-300" />
}

function WeeklyPreview() {
  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {weekDays.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 + i * 0.04 }}
          className={`relative flex flex-col items-center justify-between rounded-xl px-1 py-3 aspect-3/5 ${
            d.today ? 'bg-red-600 shadow-[0_10px_22px_-10px_rgba(220,38,38,0.5)]' : 'bg-white border border-neutral-200'
          }`}
        >
          <span className={`text-[8px] font-bold tracking-[0.18em] ${d.today ? 'text-white/70' : d.status === 'neutral' ? 'text-neutral-300' : 'text-neutral-400'}`}>
            {d.day}
          </span>
          <span className={`font-display text-lg sm:text-2xl font-black tabular-nums ${d.today ? 'text-white' : d.status === 'neutral' ? 'text-neutral-300' : 'text-neutral-900'}`}>
            {d.date}
          </span>
          <StatusMark status={d.status} />
        </motion.div>
      ))}
    </div>
  )
}

function MacrosPreview() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.15)] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <FireIcon size={13} weight="fill" className="text-red-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Hoje</span>
      </div>
      <div className="mb-1">
        <span className="font-display text-4xl sm:text-5xl font-black text-neutral-950 tabular-nums leading-none">1.310</span>
        <span className="text-neutral-400 font-bold text-xs sm:text-sm ml-2">/ 2.200 kcal</span>
      </div>
      <div className="h-1.5 rounded-full bg-red-50 overflow-hidden mt-4 mb-5">
        <motion.div
          className="h-full rounded-full bg-red-600"
          initial={{ width: 0 }}
          whileInView={{ width: '59%' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.34, 1.05, 0.64, 1], delay: 0.2 }}
        />
      </div>
      <div className="flex flex-col gap-3">
        {macros.map((m, i) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-500">{m.label}</span>
              <span className="font-display text-xs font-black tabular-nums" style={{ color: m.color }}>
                {m.value}<span className="text-neutral-400 font-bold">/{m.max}g</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: m.bg }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(m.value / m.max) * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: [0.34, 1.05, 0.64, 1], delay: 0.35 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SearchPreview() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-[0_20px_45px_-25px_rgba(0,0,0,0.15)] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <MagnifyingGlassIcon size={12} weight="bold" className="text-neutral-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-neutral-500">Buscar</span>
        </div>
        <span className="text-[9px] font-black text-emerald-600 tabular-nums tracking-[0.18em]">4 / 10.247</span>
      </div>

      <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-2.5 mb-3">
        <span className="font-display text-sm sm:text-base font-bold text-neutral-900 flex-1">
          arroz
          <motion.span
            className="inline-block w-0.5 h-4 bg-red-600 align-middle ml-0.5"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </span>
        <kbd className="text-[9px] font-bold text-neutral-500 bg-white border border-neutral-200 rounded px-1 py-0.5">⌘K</kbd>
      </div>

      <div className="flex flex-col gap-1.5">
        {searchResults.map((r, i) => (
          <motion.div
            key={r.name}
            className={`group flex items-center gap-2.5 sm:gap-3 rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
              i === 0
                ? 'bg-red-50/60 border border-red-200'
                : 'bg-white border border-neutral-200 hover:border-neutral-300'
            }`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 + i * 0.08 }}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? 'bg-red-600' : 'bg-neutral-100'}`}>
              <ForkKnifeIcon size={13} weight="duotone" className={i === 0 ? 'text-white' : 'text-neutral-500'} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-[12px] font-bold text-neutral-900 truncate">{r.name}</p>
                {r.tag && (
                  <span className="text-[7px] font-black tracking-[0.15em] text-red-600 bg-white border border-red-200 rounded-full px-1 py-0.5 leading-none shrink-0">
                    {r.tag}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-500 truncate">{r.meta}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-display text-sm font-black text-neutral-900 tabular-nums leading-none">{r.kcal}</p>
              <p className="text-[9px] text-neutral-400 font-bold mt-0.5">kcal</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface Course {
  course: string
  number: string
  title: ReactNode
  description: string
  preview: ReactNode
}

const menu: Course[] = [
  {
    course: 'Entrada',
    number: 'I.',
    title: <>Sete dias em uma <span className="text-red-600">batida visual.</span></>,
    description:
      'Cada quadradinho conta como foi o dia. Verde, amarelo, vermelho — você sabe na hora se o padrão está bom ou se algo precisa mudar.',
    preview: <WeeklyPreview />,
  },
  {
    course: 'Prato Principal',
    number: 'II.',
    title: <>Macros que <span className="text-red-600">enchem na sua frente.</span></>,
    description:
      'Proteína, carbo, gordura e calorias em barras que sobem em tempo real. Você não interpreta — você vê o quanto falta no copo.',
    preview: <MacrosPreview />,
  },
  {
    course: 'Sobremesa',
    number: 'III.',
    title: <>Cada variação. <span className="text-red-600">Cada grama.</span></>,
    description:
      'Base oficial TACO da Unicamp + alimentos catalogados pela comunidade. É a sua comida, com os números certos.',
    preview: <SearchPreview />,
  },
]

export default function Features() {
  return (
    <section className="relative bg-stone-50 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">

        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
        >
          <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[56px] font-black tracking-[-0.04em] text-neutral-950 leading-[0.92]">
            O que está sendo<br />
            <span className="italic text-red-600">servido hoje.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 hidden md:block" />

          <div className="flex flex-col gap-20 sm:gap-16">
            {menu.map((c, i) => (
              <motion.article
                key={c.course}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1], delay: i * 0.08 }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  <div className="md:w-1/2 order-2 md:order-1">
                    <h3 className="font-display text-[24px] sm:text-[28px] lg:text-[32px] font-black tracking-[-0.02em] text-neutral-950 leading-[1.05] mb-3">
                      {c.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-neutral-600 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="md:w-1/2 order-1 md:order-2">
                    {c.preview}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
