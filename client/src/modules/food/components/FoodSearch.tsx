import { MagnifyingGlass } from '@phosphor-icons/react'

interface FoodSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function FoodSearch({ value, onChange }: FoodSearchProps) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="text"
        placeholder="Ex: frango grelhado, arroz, brócolis..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-sm font-medium text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-all duration-200 shadow-sm"
      />
    </div>
  )
}
