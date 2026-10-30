import { MACROS } from '@/shared/config/macros'

type Props = {
  protein: number
  carbs: number
  fat: number
}

export default function MacroChipsRow({ protein, carbs, fat }: Props) {
  const values = { protein, carbs, fat }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {MACROS.map((macro) => {
        // CSS vars no lugar do hex do config: o hex é sempre o tom claro.
        const color = `var(--macro-${macro.field})`
        const track = `var(--macro-${macro.field}-light)`
        const MacroIcon = macro.icon
        return (
          <span
            key={macro.field}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums"
            style={{ backgroundColor: track, color }}
          >
            <MacroIcon size={16} style={{ color }} />
            {Math.round(values[macro.field])}g {macro.label}
          </span>
        )
      })}
    </div>
  )
}
