import { Flame, Ham, Wheat, Droplets } from 'lucide-react'
import type { MealTotals } from '../types/snackSuggestion'

interface MacroChipsProps {
  totals: MealTotals
}

const CHIPS = [
  { icon: Flame, field: 'calories', label: 'kcal', tone: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
  { icon: Ham, field: 'protein', label: 'g prot', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { icon: Wheat, field: 'carbs', label: 'g carb', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' },
  { icon: Droplets, field: 'fat', label: 'g gord', tone: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' },
] as const

export default function MacroChips({ totals }: MacroChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {CHIPS.map(({ icon: Icon, field, label, tone }) => (
        <span
          key={field}
          className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${tone}`}
        >
          <Icon size={11} />
          {Math.round(totals[field]).toLocaleString('pt-BR')} {label}
        </span>
      ))}
    </div>
  )
}
