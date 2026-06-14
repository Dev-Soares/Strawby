import { Plus, ForkKnifeIcon } from '@phosphor-icons/react'

type Props = {
  title: string
  description: string
  onAddClick: () => void
}

export default function MealEmptyState({ title, description, onAddClick }: Props) {
  return (
    <div className="p-8 text-center mb-6">
      <div className="w-14 h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
        <ForkKnifeIcon size={22} weight="duotone" className="text-neutral-500 dark:text-neutral-300" />
      </div>
      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-1">{title}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">{description}</p>
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
