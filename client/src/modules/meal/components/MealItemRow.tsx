import { useState } from 'react'
import { X, PencilSimple, Check } from '@phosphor-icons/react'
import type { FoodItem } from '../types/meal'
import type { MealTypeConfig } from '@/shared/config/mealTypes'
import MacroChipsRow from './MacroChipsRow'

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
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-bold text-neutral-950 dark:text-neutral-100 truncate">{name}</p>
          {editing ? (
            <div className="flex items-center gap-1.5 mt-1.5">
              <input
                type="number"
                value={value}
                autoFocus
                min={1}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') save()
                  if (e.key === 'Escape') setEditing(false)
                }}
                className="w-20 text-sm font-bold text-neutral-950 dark:text-neutral-100 bg-transparent outline-none border-b-2 border-neutral-200 dark:border-neutral-700 focus:border-neutral-500 dark:focus:border-neutral-400 pb-0.5 tabular-nums"
              />
              <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">g</span>
            </div>
          ) : (
            <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mt-0.5">
              {Math.round(item.quantity)}g
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-lg sm:text-xl font-extrabold tabular-nums leading-none" style={{ color: cfg.theme }}>
              {Math.round(item.calories)}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mt-0.5">
              kcal
            </p>
          </div>
          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={isUpdatePending}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: cfg.theme, color: '#ffffff' }}
                aria-label="Salvar quantidade"
              >
                <Check size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300 cursor-pointer shrink-0"
                aria-label="Cancelar edição"
              >
                <X size={14} weight="bold" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEdit}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300 cursor-pointer shrink-0"
                aria-label={`Editar quantidade de ${name}`}
              >
                <PencilSimple size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(item)}
                disabled={isRemovePending}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: cfg.theme, color: '#ffffff' }}
                aria-label={`Remover ${name}`}
              >
                <X size={14} weight="bold" />
              </button>
            </>
          )}
        </div>
      </div>
      <MacroChipsRow protein={item.protein} carbs={item.carbs} fat={item.fat} />
    </div>
  )
}
