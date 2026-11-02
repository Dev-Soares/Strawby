import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { getMealType, getMealAccent, type MealTypeConfig } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { mealTypeValues, type MealType } from '../types/snackSuggestion'

interface MealTypeSelectProps {
  value: MealType
  onChange: (value: MealType) => void
  disabled?: boolean
}

export default function MealTypeSelect({ value, onChange, disabled }: MealTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'

  const selectedConfig = getMealType(value)
  const selectedAccent = getMealAccent(selectedConfig, isDark)
  const SelectedIcon = selectedConfig.icon

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

  const renderOption = (config: MealTypeConfig, mealType: MealType) => {
    const accent = getMealAccent(config, isDark)
    const Icon = config.icon
    const isSelected = mealType === value

    return (
      <button
        key={mealType}
        type="button"
        onClick={() => {
          onChange(mealType)
          setIsOpen(false)
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: accent.surface }}
        >
          <Icon size={18} style={{ color: accent.strong }} />
        </span>
        <span className="flex-1 font-medium" style={{ color: accent.ink }}>
          {config.name}
        </span>
        {isSelected && <Check size={16} style={{ color: accent.strong }} />}
      </button>
    )
  }

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className="flex w-full items-center gap-2 rounded-full bg-transparent py-1 text-left text-sm focus:outline-none disabled:opacity-60"
        style={{ color: selectedAccent.ink }}
      >
        <SelectedIcon size={18} style={{ color: selectedAccent.strong }} />
        <span className="font-medium">{selectedConfig.name}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: selectedAccent.strong }}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {mealTypeValues.map((mealType) => renderOption(getMealType(mealType), mealType))}
        </div>
      )}
    </div>
  )
}
