import { CookingPot } from '@phosphor-icons/react'
import type { SelectFoodTab } from '../types/selectableItem'

type TabDef = { key: SelectFoodTab; label: string; icon?: typeof CookingPot }

type Props = {
  tab: SelectFoodTab
  onChange: (tab: SelectFoodTab) => void
  includeRecipes: boolean
}

export default function SelectFoodTabs({ tab, onChange, includeRecipes }: Props) {
  const tabs: TabDef[] = [
    { key: 'public', label: 'Todos' },
    { key: 'private', label: 'Meus alimentos' },
  ]
  if (includeRecipes) tabs.push({ key: 'recipes', label: 'Receitas', icon: CookingPot })

  return (
    <div className="flex gap-1 mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 transition-colors duration-300">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 px-2 sm:px-3 ${
            tab === t.key
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          {t.icon && <t.icon size={16} weight="bold" />}
          {t.label}
        </button>
      ))}
    </div>
  )
}
