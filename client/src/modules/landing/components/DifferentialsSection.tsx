import { useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Zap,
} from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'
import { foodShowcaseItems } from './FoodShowcase'

const FireAnimation = lazy(() => import('../../patient/components/FireAnimation'))

const ease = [0.34, 1.05, 0.64, 1] as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease, delay },
})

const getFoodGridItemClass = (index: number) => {
  const row = Math.floor(index / 6)
  const column = index % 6
  const isOuterEdge = column === 0 || column === 5

  if (isOuterEdge) return column === 0 ? '-translate-x-1' : 'translate-x-1'
  if (row === 0) return 'translate-y-2'
  if (row === 1) return 'translate-y-1'
  if (row === 3) return '-translate-y-1'
  if (row === 4) return '-translate-y-2'
  return ''
}

// Mock da semana exibida no preview da landing page.
const CALENDAR_MONTH = 'Novembro 2026'
const calendarDays: Array<{ label: string; day: number; score?: number; isToday?: boolean }> = [
  { label: 'S', day: 2, score: 32 },
  { label: 'T', day: 3, score: 90 },
  { label: 'Q', day: 4, score: 85 },
  { label: 'Q', day: 5, score: 78 },
  { label: 'S', day: 6, score: 55 },
  { label: 'S', day: 7, score: 88 },
  { label: 'D', day: 8, isToday: true },
]

const GOOD_THRESHOLD = 70

function getCalendarTile(score: number | undefined): {
  background: string
  foreground: string
} {
  if (score === undefined) {
    return {
      background: 'bg-neutral-100 dark:bg-neutral-800',
      foreground: 'text-neutral-400 dark:text-neutral-500',
    }
  }
  if (score >= GOOD_THRESHOLD) {
    return {
      background: 'bg-[var(--score-good-light)]',
      foreground: 'text-[var(--score-good)]',
    }
  }
  return {
    background: 'bg-[var(--score-low-light)]',
    foreground: 'text-[var(--score-low)]',
  }
}

export default function DifferentialsSection() {
  useEffect(() => {
    preloadMascotActions(['writing', 'thinking', 'celebrate'])
  }, [])

  return (
    <section
      id="diferenciais"
      className="bg-white py-20 transition-colors duration-300 sm:py-28 lg:py-36 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* ================================================================= */}
        {/* 1. Headline Principal da Seção                                    */}
        {/* ================================================================= */}
        

        {/* ================================================================= */}
        {/* 2. Três Composições Editoriais (Visual no Topo, Texto Embaixo)    */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-y-28 sm:gap-y-36 lg:gap-y-44">
          {/* --------------------------------------------------------------- */}
          {/* Diferencial 01: Simplicidade de verdade                         */}
          {/* --------------------------------------------------------------- */}
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-16">
            {/* Visual no topo: Conversão inteligente em tempo real */}
            <motion.div
              className="relative mx-auto flex w-full max-w-lg items-end justify-center lg:mx-0 lg:w-1/2 lg:max-w-none"
              {...fadeUp(0)}
            >
              <div className="w-full rounded-3xl border-2 border-stone-200 bg-stone-50/70 p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                {/* Input simulado de registro simplificado */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-stone-200 bg-white px-3.5 py-3 shadow-xs dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-red-600" />
                    <span className="text-xs font-bold text-neutral-800 sm:text-sm dark:text-neutral-200">
                      Frango grelhado 150g + Arroz 120g
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCheck size={12} strokeWidth={2.5} />
                    Auto
                  </span>
                </div>

                {/* Linhas de alimentos decompostos instantaneamente */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-2xs dark:bg-neutral-800">
                    <div>
                      <p className="font-display text-xs font-black text-neutral-900 sm:text-sm dark:text-neutral-100">
                        Filé de Peito de Frango
                      </p>
                      <p className="text-[10px] font-medium text-neutral-400">150g · 240 kcal</p>
                    </div>
                    <span className="font-display text-xs font-black text-emerald-600 dark:text-emerald-400">
                      48g proteína
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-2xs dark:bg-neutral-800">
                    <div>
                      <p className="font-display text-xs font-black text-neutral-900 sm:text-sm dark:text-neutral-100">
                        Arroz Branco Cozido
                      </p>
                      <p className="text-[10px] font-medium text-neutral-400">120g · 154 kcal</p>
                    </div>
                    <span className="font-display text-xs font-black text-sky-600 dark:text-sky-400">
                      34g carbos
                    </span>
                  </div>
                </div>

              </div>

              {/* Mascote 'writing' ao lado da composição */}
              <div className="pointer-events-none absolute -bottom-6 -right-4 h-26 w-26 sm:-bottom-8 sm:-right-8 sm:h-32 sm:w-32 lg:-right-12 lg:h-36 lg:w-36">
                <StrawbyMascot
                  action="writing"
                  playback="once"
                  className="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.16)]"
                />
              </div>
            </motion.div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.1)}>
              <h3 className="mb-4 font-display text-[34px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:text-[44px] dark:text-neutral-100">
                Menos contas. <span className="text-red-600">Mais praticidade.</span>
              </h3>
              <p className="text-base font-medium leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                Você não precisa perder tempo calculando tudo manualmente. Registre suas refeições e deixe o Strawby organizar as informações nutricionais.
              </p>
            </motion.div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Diferencial 02: Variedade — Nuvem cheia, stacked                */}
          {/* --------------------------------------------------------------- */}
          <div className="order-3 flex flex-col items-center gap-8 sm:gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-16">
            {/* Visual no topo: Nuvem de alimentos + Mascote thinking */}
            <div className="relative mx-auto flex h-[400px] w-full max-w-2xl items-end justify-center sm:h-[440px] lg:mx-0 lg:h-[480px] lg:w-1/2 lg:max-w-none">
              {/* Grid de alimentos ao fundo */}
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-[42%] mx-auto grid w-[min(100%,520px)] -translate-y-1/2 grid-cols-6 place-items-center gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-5 lg:gap-x-5 lg:gap-y-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04 } },
                }}
              >
                {foodShowcaseItems.map((food, index) => (
                  <div
                    key={`${food.color}-${index}`}
                    className={`flex items-center justify-center ${getFoodGridItemClass(index)}`}
                  >
                    <food.icon
                      size={38}
                      className={`${food.color} select-none drop-shadow-xs transition-transform duration-200 hover:scale-125 sm:size-11`}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Mascote 'thinking' centralizado e congelado no frame final */}
              <motion.div
                className="relative z-10 flex -translate-y-8 flex-col items-center pb-1 sm:-translate-y-10 lg:-translate-y-12"
                {...fadeUp(0.08)}
              >
                <div className="h-48 w-48 sm:h-56 sm:w-56 lg:h-60 lg:w-60">
                  <StrawbyMascot
                    action="thinking"
                    playback="once"
                    className="h-full w-full drop-shadow-[0_20px_32px_rgba(220,38,38,0.2)]"
                  />
                </div>
              </motion.div>
            </div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.1)}>
              <h3 className="mb-4 font-display text-[34px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:text-[44px] dark:text-neutral-100">
                Do açaí ao pão de queijo. <span className="text-red-600">Tudo aqui.</span>
              </h3>
              <p className="text-base font-medium leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                Encontre o que você realmente come no dia a dia. Uma base com milhares de alimentos da nossa culinária, sem precisar traduzir ingredientes ou adivinhar calorias.
              </p>
            </motion.div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Diferencial 03: Calendário do App + Melhor Sequência com Mascote */}
          {/* --------------------------------------------------------------- */}
          <div className="order-2 flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            {/* Visual: semana de desempenho e resumo de score do app */}
            <motion.div
              className="w-full max-w-lg space-y-4 lg:mx-0 lg:w-1/2 lg:max-w-none"
              {...fadeUp(0)}
            >
              <div className="rounded-3xl border-2 border-stone-200 bg-white p-4 shadow-sm transition-colors duration-300 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/40">
                        <CalendarDays size={16} className="text-red-500" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-extrabold leading-tight tracking-tight text-neutral-950 truncate dark:text-neutral-100">
                          {CALENDAR_MONTH}
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Minha semana
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <ChevronLeft size={14} />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((item) => (
                      <span
                        key={item.day}
                        className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500"
                      >
                        {item.label}
                      </span>
                    ))}
                    {calendarDays.map((item) => {
                      const tile = getCalendarTile(item.score)
                      return (
                        <div
                          key={item.day}
                          className={`flex aspect-square items-center justify-center rounded-xl text-sm font-extrabold tabular-nums transition-colors duration-300 ${tile.background} ${tile.foreground} ${
                            item.isToday
                              ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
                              : ''
                          }`}
                        >
                          {item.day}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-[var(--score-good-light)] ring-2 ring-inset ring-[var(--score-good)]" />
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Dia bom</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-[var(--score-low-light)] ring-2 ring-inset ring-[var(--score-low)]" />
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Abaixo</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-neutral-100 dark:bg-neutral-800" />
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">Sem registro</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex min-h-28 items-center gap-3 rounded-3xl border-2 border-stone-200 bg-white px-3 py-3 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                    <Suspense fallback={<Flame size={52} className="text-red-600" />}>
                      <FireAnimation size={72} />
                    </Suspense>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-black leading-none text-red-600">12</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-neutral-950 dark:text-neutral-100">dias consecutivos</p>
                  </div>
                </div>

                <div className="flex min-h-28 items-center gap-3 rounded-3xl border-2 border-stone-200 bg-white px-3 py-3 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                    <Trophy size={54} strokeWidth={1.7} className="text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-black leading-none text-amber-500">21</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-neutral-950 dark:text-neutral-100">melhor sequência</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.15)}>
              <h3 className="mb-4 font-display text-[34px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:text-[44px] dark:text-neutral-100">
                Pontuação diária e sequência. <span className="text-red-600">Sem perder o ritmo.</span>
              </h3>
              <p className="text-base font-medium leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                Acompanhe seu Score do dia e veja se suas escolhas estão no caminho certo. Mantenha sua sequência ativa, bata recordes e transforme consistência em motivação real.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
