import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import type { FoodItem } from '../types/meal'
import type { MealTypeConfig } from '@/shared/config/mealTypes'
import { getMealAccent } from '@/shared/config/mealTypes'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import MacroChipsRow from './MacroChipsRow'
import { nonNegativeInputProps } from '@/shared/utils/nonNegativeInputProps'

type Props = {
  item: FoodItem
  cfg: MealTypeConfig
  onRemove: (item: FoodItem) => void
  onUpdateQuantity: (item: FoodItem, quantity: number) => void
  isRemovePending: boolean
  isUpdatePending: boolean
}

export default function MealItemRow({ item, cfg, onRemove, onUpdateQuantity, isRemovePending, isUpdatePending }: Props) {
  const name = (item.food ?? item.privateFood)?.name ?? 'Alimento'
  const { resolvedTheme } = useThemeContext()
  const accent = getMealAccent(cfg, resolvedTheme === 'dark')
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(Math.round(item.quantity)))

  const startEdit = () => {
    setValue(String(Math.round(item.quantity)))
    setEditing(true)
  }

  const save = () => {
    const qty = Number(value)
    if (!Number.isFinite(qty) || qty <= 0) return
    if (qty !== Math.round(item.quantity)) onUpdateQuantity(item, qty)
    setEditing(false)
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors duration-300 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-neutral-950 transition-colors duration-300 dark:text-neutral-100">
            {name}
          </p>
          {editing ? (
            <div className="mt-1.5 flex items-center gap-1.5">
              <input
                type="number"
                {...nonNegativeInputProps}
                value={value}
                autoFocus
                min={1}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  nonNegativeInputProps.onKeyDown(e)
                  if (e.key === 'Enter') save()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="w-20 border-b-2 border-neutral-200 bg-transparent pb-0.5 text-sm font-bold tabular-nums text-neutral-950 outline-none transition-colors duration-150 focus:border-neutral-500 dark:border-neutral-700 dark:text-neutral-100 dark:focus:border-neutral-400"
              />
              <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">g</span>
            </div>
          ) : (
            <p className="mt-0.5 text-sm font-medium tabular-nums text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
              {Math.round(item.quantity)}g
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-baseline gap-1">
            <span
              className="font-display text-xl font-extrabold leading-none tabular-nums"
              style={{ color: accent.ink }}
            >
              {Math.round(item.calories).toLocaleString('pt-BR')}
            </span>
            <span className="text-sm font-semibold" style={{ color: accent.ink }}>
              kcal
            </span>
          </span>

          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={isUpdatePending}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: accent.surface, color: accent.ink }}
                aria-label="Salvar quantidade"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors duration-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                aria-label="Cancelar edição"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEdit}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors duration-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                aria-label={`Editar quantidade de ${name}`}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => onRemove(item)}
                disabled={isRemovePending}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 text-red-600 transition-colors duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-red-950/40"
                aria-label={`Remover ${name}`}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      <MacroChipsRow protein={item.protein} carbs={item.carbs} fat={item.fat} />
    </div>
  )
}
