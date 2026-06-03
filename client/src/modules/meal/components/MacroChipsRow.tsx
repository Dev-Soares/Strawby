type Props = {
  protein: number
  carbs: number
  fat: number
}

export default function MacroChipsRow({ protein, carbs, fat }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
        <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200 tabular-nums">
          {Math.round(protein)}<span className="text-amber-700 dark:text-amber-300 font-bold">g</span>
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 ml-auto">
          Prot
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        <span className="text-[11px] font-extrabold text-blue-900 dark:text-blue-200 tabular-nums">
          {Math.round(carbs)}<span className="text-blue-700 dark:text-blue-300 font-bold">g</span>
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800 dark:text-blue-300 ml-auto">
          Carb
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 rounded-lg px-2 py-1.5 transition-colors duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
        <span className="text-[11px] font-extrabold text-violet-900 dark:text-violet-200 tabular-nums">
          {Math.round(fat)}<span className="text-violet-700 dark:text-violet-300 font-bold">g</span>
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-violet-800 dark:text-violet-300 ml-auto">
          Gord
        </span>
      </div>
    </div>
  )
}
