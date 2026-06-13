import { Plus, Fire } from '@phosphor-icons/react'
import type { SelectableItem } from '../types/selectableItem'

type Props = {
  item: SelectableItem
  onSelect: (item: SelectableItem) => void
  isPending?: boolean
}

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

export default function SelectableFoodCard({ item, onSelect, isPending }: Props) {
  const isRecipe = item.kind === 'recipe'
  const subtitle = isRecipe
    ? 'Receita'
    : item.kind === 'private' && item.servingSize
      ? `por ${item.servingSize}g`
      : 'por 100g'

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 relative">
      <button
        type="button"
        onClick={() => onSelect(item)}
        disabled={isPending}
        className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 flex items-center justify-center transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer z-10"
        aria-label={`Adicionar ${item.name}`}
      >
        {isPending
          ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
          : <Plus size={16} weight="bold" />
        }
      </button>

      <div className="mb-3 pr-10">
        <p className="text-base font-bold text-neutral-950 dark:text-neutral-100 leading-snug mb-0.5 transition-colors duration-300">
          {item.name}
        </p>
        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
        <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tabular-nums leading-none transition-colors duration-300">
          {Math.round(item.calories)}
        </span>
        <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 pb-0.5 transition-colors duration-300">kcal</span>
      </div>

      <div className="flex gap-4">
        {macros.map(({ key, label, colorClass }) => (
          <div key={key} className="flex-1 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">{label}</span>
            <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
              {item[key]}g
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
