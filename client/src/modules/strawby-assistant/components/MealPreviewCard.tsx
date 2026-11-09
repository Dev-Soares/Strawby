import { motion } from 'framer-motion'
import { Check, Clock, Trash2, X } from 'lucide-react'
import { useThemeContext } from '@/shared/hooks/useThemeContext'
import { getMealAccent, getMealType } from '@/shared/config/mealTypes'
import { CALORIES, MACROS } from '@/shared/config/macros'
import { useMealDraftEditor } from '../hooks/useMealDraftEditor'
import type { MealDraft, MealDraftItem } from '../types/chat'

interface MealPreviewCardProps {
  draft: MealDraft
  onConfirm: (draft: MealDraft) => void
  onDiscard: () => void
  isConfirming: boolean
}

export default function MealPreviewCard({
  draft,
  onConfirm,
  onDiscard,
  isConfirming,
}: MealPreviewCardProps) {
  const { resolvedTheme } = useThemeContext()
  const isDark = resolvedTheme === 'dark'
  const { items, setQuantity, removeItem, totals, edited, canConfirm } = useMealDraftEditor(draft)

  const config = getMealType(draft.mealType ?? '')
  const MealIcon = config.icon
  const CaloriesIcon = CALORIES.icon
  const { surface, ink, strong } = getMealAccent(config, isDark)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: surface }}
          >
            <MealIcon size={23} style={{ color: ink }} />
          </span>

          <h3
            className="font-display min-w-0 flex-1 truncate text-lg leading-none font-extrabold tracking-tight sm:text-xl"
            style={{ color: ink }}
          >
            {draft.name}
          </h3>

          {draft.time && (
            <span
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: surface }}
            >
              <Clock size={16} style={{ color: strong }} />
              <span
                className="text-sm leading-none font-extrabold tabular-nums"
                style={{ color: ink }}
              >
                {draft.time}
              </span>
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <DraftItemRow
              key={item.foodId}
              item={item}
              disabled={isConfirming}
              onQuantityChange={(quantity) => setQuantity(item.foodId, quantity)}
              onRemove={() => removeItem(item.foodId)}
            />
          ))}
        </ul>

        {items.length === 0 && (
          <p className="mt-4 rounded-xl bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
            Você removeu todos os itens. Descarte e me conta de novo o que comeu.
          </p>
        )}

        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
            style={{ backgroundColor: surface, color: ink }}
          >
            <CaloriesIcon size={18} style={{ color: strong }} />
            {Math.round(totals.calories).toLocaleString('pt-BR')} kcal
          </span>

          {MACROS.map((macro) => {
            const MacroIcon = macro.icon
            return (
              <span
                key={macro.field}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums"
                style={{ backgroundColor: surface, color: ink }}
              >
                <MacroIcon size={18} style={{ color: strong }} />
                {Math.round(totals[macro.field])}g {macro.label}
              </span>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onConfirm(edited)}
            disabled={isConfirming || !canConfirm}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={18} />
            {isConfirming ? 'Adicionando...' : 'Adicionar no meu dia'}
          </button>

          <button
            type="button"
            onClick={onDiscard}
            disabled={isConfirming}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <X size={18} />
            Descartar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface DraftItemRowProps {
  item: MealDraftItem
  disabled: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

function DraftItemRow({ item, disabled, onQuantityChange, onRemove }: DraftItemRowProps) {
  return (
    <li className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800/50">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {item.name}
      </span>

      <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1 transition-colors duration-200 focus-within:border-red-500 dark:border-neutral-700 dark:bg-neutral-900">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={Math.round(item.quantity)}
          disabled={disabled}
          onChange={(event) => onQuantityChange(Math.max(0, Number(event.target.value)))}
          onFocus={(event) => event.target.select()}
          className="w-12 appearance-none border-0 bg-transparent p-0 text-right text-sm font-semibold tabular-nums text-neutral-900 focus:ring-0 focus:outline-none disabled:opacity-60 dark:text-neutral-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          aria-label={`Quantidade de ${item.name}`}
        />
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {item.unit}
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
        aria-label={`Remover ${item.name}`}
      >
        <Trash2 size={17} />
      </button>
    </li>
  )
}
