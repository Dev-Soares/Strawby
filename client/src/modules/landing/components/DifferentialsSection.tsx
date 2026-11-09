import { useEffect, useRef } from 'react'
import { lazy, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Mic,
  Trophy,
} from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'
import { foodShowcaseItems } from '../config/foodShowcaseItems'

const FireAnimation = lazy(() => import('../../patient/components/FireAnimation'))

const ease = [0.34, 1.05, 0.64, 1] as const
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease, delay },
})

/**
 * Mascote que só começa a animar quando entra na tela — montado antes, a
 * animação termina longe dos olhos e sobra só a pose final congelada.
 */
const InViewMascot = ({
  action,
  className,
  mascotClassName,
}: {
  action: 'writing' | 'thinking'
  className: string
  mascotClassName: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div ref={ref} className={className}>
      {isInView && (
        <StrawbyMascot action={action} playback="once" className={mascotClassName} />
      )}
    </div>
  )
}

// Curva o grid em meia-lua: colunas externas descem, centrais sobem.
// Os offsets se compensam (média ~0) para o bloco não mudar de posição.
const getFoodArcItemClass = (index: number) => {
  const column = index % 6
  const distanceFromCenter = Math.abs(column - 2.5)

  if (distanceFromCenter > 2) {
    const horizontal = column === 0 ? '-translate-x-1' : 'translate-x-1'
    return `${horizontal} translate-y-4 sm:translate-y-6`
  }
  if (distanceFromCenter > 1) return '-translate-y-1'
  return '-translate-y-2 sm:-translate-y-3.5'
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
      background: 'bg-neutral-100',
      foreground: 'text-neutral-400',
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
      className="bg-white py-14 transition-colors duration-300 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        {/* ================================================================= */}
        {/* 1. Headline Principal da Seção                                    */}
        {/* ================================================================= */}
        

        {/* ================================================================= */}
        {/* 2. Três Composições Editoriais (Visual no Topo, Texto Embaixo)    */}
        {/* ================================================================= */}
        <div className="flex flex-col gap-y-20 sm:gap-y-36 lg:gap-y-44">
          {/* --------------------------------------------------------------- */}
          {/* Diferencial 01: Assistente Strawby — registro por conversa      */}
          {/* --------------------------------------------------------------- */}
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-16">
            {/* Visual: a conversa real do assistente, da fala ao registro */}
            <motion.div
              className="relative mx-auto flex w-full max-w-lg items-end justify-center lg:mx-0 lg:w-1/2 lg:max-w-none"
              {...fadeUp(0)}
            >
              {/* Conversa com o assistente: a pessoa conta, o Strawby registra */}
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                {/* O que a pessoa escreve */}
                <div className="flex justify-end">
                  <p className="max-w-[88%] rounded-2xl rounded-br-md bg-stone-100 px-3.5 py-2.5 text-[13px] font-medium leading-relaxed text-neutral-800">
                    comi 150g de frango grelhado com 120g de arroz no almoço
                  </p>
                </div>

                {/* O Strawby respondendo — o mascote em tamanho de gente, falando */}
                <div className="mt-5 flex items-end gap-1">
                  <InViewMascot
                    action="writing"
                    className="h-24 w-24 shrink-0 sm:h-36 sm:w-36"
                    mascotClassName="h-full w-full drop-shadow-[0_12px_20px_rgba(220,38,38,0.16)]"
                  />

                  <p className="mb-6 rounded-2xl rounded-bl-md border-2 border-stone-200 bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-neutral-700 shadow-[0_14px_30px_-22px_rgba(28,25,23,0.5)] sm:text-sm">
                    Pronto, registrei seu almoço com{' '}
                    <span className="font-bold text-neutral-900">150g de frango</span> e{' '}
                    <span className="font-bold text-neutral-900">120g de arroz</span> — deu{' '}
                    <span className="font-bold text-red-600">394 kcal</span>.
                  </p>
                </div>

                {/* Campo do assistente: deixa claro que é conversa — escrita ou por voz */}
                <div
                  aria-hidden
                  className="-mt-2 flex items-center gap-2.5 rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 shadow-[0_14px_30px_-24px_rgba(28,25,23,0.5)]"
                >
                  <span className="flex-1 truncate text-[13px] font-medium text-neutral-400">
                    Digite ou fale o que você comeu...
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-neutral-500">
                    <Mic size={15} strokeWidth={2.5} />
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    <ArrowUp size={15} strokeWidth={3} />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.1)}>
              <h3 className="mb-3 font-display text-[27px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:mb-4 sm:text-[44px]">
                Você conta o que comeu. <span className="text-red-600">Ele registra.</span>
              </h3>
              <p className="text-[15px] font-medium leading-relaxed text-neutral-600 sm:text-lg">
                Escreva ou fale do jeito que você falaria com uma pessoa: &ldquo;comi frango com arroz no almoço&rdquo;. O Assistente Strawby entende, calcula as calorias e lança a refeição no seu diário. Ele também sugere refeições e monta seu plano alimentar.
              </p>
            </motion.div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Diferencial 02: Variedade — Nuvem cheia, stacked                */}
          {/* --------------------------------------------------------------- */}
          <div className="order-3 flex flex-col items-center gap-8 sm:gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-16">
            {/* Visual no topo: Nuvem de alimentos + Mascote thinking */}
            <div className="relative mx-auto flex h-[300px] w-full max-w-2xl items-end justify-center sm:h-[440px] lg:mx-0 lg:h-[480px] lg:w-1/2 lg:max-w-none">
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
                    className={`flex items-center justify-center ${getFoodArcItemClass(index)}`}
                  >
                    <food.icon
                      size={28}
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
                <InViewMascot
                  action="thinking"
                  className="h-36 w-36 sm:h-56 sm:w-56 lg:h-60 lg:w-60"
                  mascotClassName="h-full w-full drop-shadow-[0_20px_32px_rgba(220,38,38,0.2)]"
                />
              </motion.div>
            </div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.1)}>
              <h3 className="mb-3 font-display text-[27px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:mb-4 sm:text-[44px]">
                Do açaí ao pão de queijo. <span className="text-red-600">Tudo aqui.</span>
              </h3>
              <p className="text-[15px] font-medium leading-relaxed text-neutral-600 sm:text-lg">
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
              <div className="rounded-3xl border-2 border-stone-200 bg-white p-4 shadow-sm transition-colors duration-300 sm:p-5">
                <div>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                        <CalendarDays size={16} className="text-red-500" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-extrabold leading-tight tracking-tight text-neutral-950 truncate">
                          {CALENDAR_MONTH}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Minha semana
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <ChevronLeft size={14} />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((item) => (
                      <span
                        key={item.day}
                        className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400"
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
                              ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white'
                              : ''
                          }`}
                        >
                          {item.day}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-100 pt-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-[var(--score-good-light)] ring-2 ring-inset ring-[var(--score-good)]" />
                    <span className="text-[11px] font-semibold text-neutral-500">Dia bom</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-[var(--score-low-light)] ring-2 ring-inset ring-[var(--score-low)]" />
                    <span className="text-[11px] font-semibold text-neutral-500">Abaixo</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-neutral-100" />
                    <span className="text-[11px] font-semibold text-neutral-500">Sem registro</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex min-h-24 flex-col items-center justify-center rounded-3xl border-2 border-stone-200 bg-white px-3 py-3 text-center shadow-sm transition-colors duration-300 sm:min-h-28 sm:flex-row sm:justify-start sm:gap-3 sm:py-3 sm:text-left">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                    <Suspense fallback={<Flame size={52} className="text-red-600" />}>
                      <FireAnimation size={56} />
                    </Suspense>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-center gap-2 sm:justify-start">
                      <span className="font-display text-2xl font-black leading-none text-red-600 sm:text-4xl">12</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-neutral-950 sm:text-xs">dias consecutivos</p>
                  </div>
                </div>

                <div className="flex min-h-24 flex-col items-center justify-center rounded-3xl border-2 border-stone-200 bg-white px-3 py-3 text-center shadow-sm transition-colors duration-300 sm:min-h-28 sm:flex-row sm:justify-start sm:gap-3 sm:py-3 sm:text-left">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                    <Trophy size={48} strokeWidth={1.7} className="text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline justify-center gap-2 sm:justify-start">
                      <span className="font-display text-2xl font-black leading-none text-amber-500 sm:text-4xl">21</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-neutral-950 sm:text-xs">melhor sequência</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Texto descritivo embaixo */}
            <motion.div className="max-w-xl text-center lg:flex-1 lg:text-left" {...fadeUp(0.15)}>
              <h3 className="mb-3 font-display text-[27px] font-black tracking-tight leading-[0.98] text-neutral-950 sm:mb-4 sm:text-[44px]">
                Pontuação diária e sequência. <span className="text-red-600">Sem perder o ritmo.</span>
              </h3>
              <p className="text-[15px] font-medium leading-relaxed text-neutral-600 sm:text-lg">
                Acompanhe sua pontuação do dia e veja se suas escolhas estão no caminho certo. Mantenha sua sequência ativa, bata recordes e transforme consistência em motivação real.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
