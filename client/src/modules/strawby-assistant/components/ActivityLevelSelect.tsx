import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ACTIVITY_LEVELS, type ActivityLevel } from '@/shared/config/activityLevels'

interface ActivityLevelSelectProps {
  /** `undefined` enquanto o usuário não escolheu — mostra o placeholder. */
  value: number | undefined
  onChange: (value: number) => void
  disabled?: boolean
}

/** Alturas crescentes das 5 barrinhas — estilo sinal de celular. */
const BAR_HEIGHTS = ['h-1.5', 'h-2', 'h-2.5', 'h-3', 'h-3.5']

/** Barrinhas crescentes — quanto mais ativo, mais cheias. */
function IntensityBars({ intensity, muted }: { intensity: number; muted?: boolean }) {
  return (
    <span className="flex shrink-0 items-end gap-0.5" aria-hidden>
      {BAR_HEIGHTS.map((height, index) => {
        const isFilled = index < intensity
        return (
          <span
            key={height}
            className={`w-1 rounded-full transition-colors duration-200 ${height} ${
              isFilled
                ? muted
                  ? 'bg-neutral-400 dark:bg-neutral-500'
                  : 'bg-red-500 dark:bg-red-400'
                : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          />
        )
      })}
    </span>
  )
}

export default function ActivityLevelSelect({ value, onChange, disabled }: ActivityLevelSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = ACTIVITY_LEVELS.find((level) => level.value === value)
  const SelectedIcon = selected?.icon

  useEffect(() => {
    if (!isOpen) return

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const renderOption = (level: ActivityLevel) => {
    const Icon = level.icon
    const isSelected = level.value === value

    return (
      <button
        key={level.value}
        type="button"
        onClick={() => {
          onChange(level.value)
          setIsOpen(false)
        }}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
          isSelected
            ? 'bg-red-50 dark:bg-red-950/30'
            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
          <Icon size={18} className="text-red-600 dark:text-red-400" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-neutral-900 dark:text-neutral-100">
            {level.label}
          </span>
          <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
            {level.description}
          </span>
        </span>
        <IntensityBars intensity={level.intensity} />
      </button>
    )
  }

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-full bg-transparent py-1 text-left text-sm focus:outline-none disabled:opacity-60 cursor-pointer"
      >
        {SelectedIcon && <SelectedIcon size={18} className="text-red-600 dark:text-red-400" />}
        <span
          className={`font-medium ${
            selected
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {selected?.label ?? 'Selecione seu nível de atividade'}
        </span>
        {selected && <IntensityBars intensity={selected.intensity} muted />}
        <ChevronDown
          size={20}
          className={`shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {ACTIVITY_LEVELS.map(renderOption)}
        </div>
      )}
    </div>
  )
}
