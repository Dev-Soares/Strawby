import { Plus, Utensils } from 'lucide-react'

type Props = {
  title: string
  description: string
  onAddClick: () => void
}

export default function MealEmptyState({ title, description, onAddClick }: Props) {
  return (
    <div className="mb-6 flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white px-4 py-12 text-center transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 transition-colors duration-300 dark:bg-neutral-800">
        <Utensils size={24} className="text-neutral-400 dark:text-neutral-500" />
      </div>
      <p className="mb-1 text-sm font-bold text-neutral-700 transition-colors duration-300 dark:text-neutral-300">
        {title}
      </p>
      <p className="mb-5 max-w-xs text-xs leading-relaxed text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
        {description}
      </p>
      <button
        type="button"
        onClick={onAddClick}
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700"
      >
        <Plus size={18} />
        Adicionar agora
      </button>
    </div>
  )
}
