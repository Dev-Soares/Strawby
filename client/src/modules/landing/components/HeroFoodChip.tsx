import { ForkKnife } from 'lucide-react'

/** Linha de refeição da UI do Strawby — o prato que o mascote está comendo. */
const HeroFoodChip = () => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-3.5 py-3 shadow-lg shadow-neutral-900/5 dark:shadow-black/30">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
        <ForkKnife size={16} className="text-red-600" />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100">
          Almoço
        </span>
        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          Arroz, frango e salada
        </span>
      </div>
    </div>
  )
}

export default HeroFoodChip
