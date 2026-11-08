import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CircleUser,
  ClipboardList,
  Coffee,
  Droplets,
  Flame,
  Ham,
  House,
  Trophy,
  Utensils,
  Wheat,
} from 'lucide-react'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'

const ease = [0.34, 1.05, 0.64, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease, delay },
})

export default function ProductShowcaseSection() {
  useEffect(() => {
    preloadMascotActions(['goodbye'])
  }, [])

  return (
    <section
      id="conheca"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-white pt-12 transition-colors duration-300 sm:pt-16 lg:pt-20 dark:bg-neutral-950"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 sm:px-8 lg:px-12">
        {/* ================================================================= */}
        {/* 1. Headline — Lateralizado (text-left) com subtítulo maior        */}
        {/* ================================================================= */}
        <div className="mb-10 max-w-2xl text-left sm:mb-14 lg:mb-16">
          <motion.h2
            className="font-display text-[42px] font-black tracking-tighter leading-[0.92] text-neutral-950 sm:text-[54px] lg:text-[62px] dark:text-neutral-100"
            {...fadeUp(0)}
          >
            Conheça o <span className="text-red-600">Strawby</span>.
          </motion.h2>

          <motion.p
            className="mt-3.5 max-w-2xl text-lg font-medium leading-relaxed text-neutral-600 sm:text-xl lg:text-[22px] dark:text-neutral-400"
            {...fadeUp(0.08)}
          >
            Muito mais simples do que você imagina. Acompanhe sua alimentação e alcance suas metas sem complicação.
          </motion.p>
        </div>

        {/* ================================================================= */}
        {/* 2. Showcase — Mascote à DIREITA e colado no tablet/aparelho       */}
        {/* ================================================================= */}
        <div className="relative mx-auto flex w-full items-end justify-center">
          {/* Spacer compensador no desktop para manter o aparelho centralizado */}
          <div
            className="hidden lg:block lg:h-64 lg:w-52 xl:h-72 xl:w-60 shrink-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Tela retangular com o layout real da aplicação */}
          <motion.div
            className="relative z-10 w-full max-w-[640px] shrink-0 rounded-3xl border-2 border-neutral-200 bg-white p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12)] sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_28px_70px_-15px_rgba(0,0,0,0.5)]"
            {...fadeUp(0.18)}
          >
            <div className="overflow-hidden rounded-2xl bg-white p-4 sm:p-5 dark:bg-neutral-900">

              {/* Cabeçalho do App: Data + Streak */}
              <div className="mb-3 flex items-center justify-between border-b border-stone-200/80 pb-2.5 dark:border-neutral-800">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Hoje, 8 nov</p>
                  <h4 className="font-display text-base font-black text-neutral-950 dark:text-neutral-100">Diário Nutricional</h4>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-2.5 py-0.5 font-display text-xs font-black text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <Flame size={13} className="fill-amber-500 text-amber-500" />
                  7 dias
                </span>
              </div>

              {/* Card Resumo Diário Oficial do Strawby */}
              <div className="mb-3 rounded-2xl bg-white p-3.5 shadow-xs border border-stone-200/70 dark:bg-neutral-800/80 dark:border-neutral-700/60">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                      <Flame size={14} className="fill-red-500 text-red-500" />
                    </span>
                    <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">Calorias do dia</span>
                  </div>
                  <span className="font-display text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                    Restam 680
                  </span>
                </div>

                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-xl font-black text-neutral-950 dark:text-neutral-100">
                    1.420 <span className="text-xs font-bold text-neutral-400">/ 2.100 kcal</span>
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400">68% da meta</span>
                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-neutral-700">
                  <div className="h-full w-[68%] rounded-full bg-red-600 transition-all duration-500" />
                </div>
              </div>

              {/* 3 Macro Bars com os Ícones Oficiais do App (Ham, Wheat, Droplets) */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                {/* Proteína */}
                <div className="rounded-xl border border-stone-200/70 bg-white p-2 text-center shadow-2xs dark:border-neutral-700/60 dark:bg-neutral-800">
                  <div className="mb-1 flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Ham size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Prot</span>
                  </div>
                  <p className="font-display text-xs font-black text-neutral-900 dark:text-neutral-100">110g</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-emerald-100/70 dark:bg-neutral-700">
                    <div className="h-full w-[78%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Carboidrato */}
                <div className="rounded-xl border border-stone-200/70 bg-white p-2 text-center shadow-2xs dark:border-neutral-700/60 dark:bg-neutral-800">
                  <div className="mb-1 flex items-center justify-center gap-1 text-sky-600 dark:text-sky-400">
                    <Wheat size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Carb</span>
                  </div>
                  <p className="font-display text-xs font-black text-neutral-900 dark:text-neutral-100">175g</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-sky-100/70 dark:bg-neutral-700">
                    <div className="h-full w-[65%] rounded-full bg-sky-500" />
                  </div>
                </div>

                {/* Gordura */}
                <div className="rounded-xl border border-stone-200/70 bg-white p-2 text-center shadow-2xs dark:border-neutral-700/60 dark:bg-neutral-800">
                  <div className="mb-1 flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                    <Droplets size={13} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Gord</span>
                  </div>
                  <p className="font-display text-xs font-black text-neutral-900 dark:text-neutral-100">42g</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-purple-100/70 dark:bg-neutral-700">
                    <div className="h-full w-[54%] rounded-full bg-purple-500" />
                  </div>
                </div>
              </div>

              {/* Lista de Refeições com Ícones Reais (Coffee, Utensils) */}
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-stone-200/50 dark:bg-neutral-800 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                      <Coffee size={14} strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Café da Manhã</p>
                      <p className="text-[10px] font-medium text-neutral-400">Ovos mexidos, torrada integral</p>
                    </div>
                  </div>
                  <span className="font-display text-xs font-black text-neutral-800 dark:text-neutral-200">410 kcal</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-stone-200/50 dark:bg-neutral-800 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Utensils size={14} strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Almoço</p>
                      <p className="text-[10px] font-medium text-neutral-400">Filé de frango, arroz, legumes</p>
                    </div>
                  </div>
                  <span className="font-display text-xs font-black text-neutral-800 dark:text-neutral-200">630 kcal</span>
                </div>
              </div>

              {/* Mini TabBar Autêntica do App */}
              <div className="flex items-center justify-around border-t border-stone-200/80 pt-2 text-neutral-400 dark:border-neutral-800">
                <div className="flex flex-col items-center gap-0.5 text-red-600 dark:text-red-500">
                  <House size={16} strokeWidth={2.5} />
                  <span className="text-[9px] font-black">Início</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Trophy size={16} strokeWidth={2} />
                  <span className="text-[9px] font-bold">Score</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <ClipboardList size={16} strokeWidth={2} />
                  <span className="text-[9px] font-bold">Plano</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <CircleUser size={16} strokeWidth={2} />
                  <span className="text-[9px] font-bold">Perfil</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Mascote 'goodbye' à DIREITA do tablet e bem colado nele */}
          <motion.div
            className="absolute -bottom-6 -right-4 z-20 h-32 w-32 sm:-bottom-8 sm:-right-6 sm:h-40 sm:w-40 lg:static lg:-ml-6 lg:h-52 lg:w-52 xl:-ml-10 xl:h-60 xl:w-60 shrink-0"
            {...fadeUp(0.12)}
          >
            <StrawbyMascot
              action="goodbye"
              playback="once"
              className="h-full w-full drop-shadow-[0_16px_28px_rgba(220,38,38,0.2)]"
            />
          </motion.div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. Carrossel Marquee STRAWBY — Tamanho Original Completo          */}
      {/* ================================================================= */}
      <div className="overflow-hidden select-none pointer-events-none mt-16 sm:mt-24 lg:mt-28">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-black tracking-[-0.05em] leading-[0.8] whitespace-nowrap pr-[0.15em] text-[clamp(72px,11vw,160px)] text-transparent [-webkit-text-stroke:1.5px_rgba(220,38,38,0.22)] dark:[-webkit-text-stroke:1.5px_rgba(220,38,38,0.3)] select-none"
            >
              STRAWBY ·
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
