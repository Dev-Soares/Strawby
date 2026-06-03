import { Plus, ForkKnifeIcon } from '@phosphor-icons/react'

type Props = {
  title: string
  description: string
  onAddClick: () => void
}

export default function MealEmptyState({ title, description, onAddClick }: Props) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center mb-6 transition-colors duration-300">
      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
        <ForkKnifeIcon size={20} weight="duotone" className="text-neutral-400 dark:text-neutral-500" />
      </div>
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4">{description}</p>
      <button
        type="button"
        onClick={onAddClick}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
      >
        <Plus size={13} weight="bold" />
        Adicionar agora
      </button>
    </div>
  )
}
