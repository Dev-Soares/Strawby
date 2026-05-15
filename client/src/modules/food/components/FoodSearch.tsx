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
        className="w-full pl-11 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 shadow-sm"
      />
    </div>
  )
}
