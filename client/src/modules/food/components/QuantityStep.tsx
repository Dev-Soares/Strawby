import { Flame, TriangleAlert } from 'lucide-react'
import type { SelectableFood } from '../types/selectableItem'
import { nonNegativeInputProps } from '@/shared/utils/nonNegativeInputProps'
import { MACROS } from '@/shared/config/macros'
import Spinner from '@/shared/components/Spinner'

type Props = {
  selectedFood: SelectableFood | null
  quantity: string
  targetId: string
  contextLabel: string
  anyPending: boolean
  onQuantityChange: (value: string) => void
  onBack: () => void
  onConfirm: () => void
}

export default function QuantityStep({
  selectedFood, quantity, targetId, contextLabel, anyPending,
  onQuantityChange, onBack, onConfirm,
}: Props) {
  const base = selectedFood?.kind === 'private' && selectedFood.servingSize ? Number(selectedFood.servingSize) : 100
  const q = Number(quantity) || 0
  const scale = (value: number) => (value * q) / base

  return (
    <div className="max-w-md mx-auto">
      {selectedFood && (
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-base font-bold text-neutral-950 transition-colors duration-300 dark:text-neutral-100">
            {selectedFood.name}
          </p>
          <p className="mt-0.5 mb-4 text-sm font-medium tabular-nums text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
            por {q}g
          </p>

          <div className="mb-4 flex items-baseline gap-1.5">
            <Flame size={16} className="shrink-0 self-center text-(--macro-calories)" />
            <span className="font-display text-xl font-extrabold leading-none tabular-nums text-(--macro-calories)">
              {Math.round(scale(selectedFood.calories)).toLocaleString('pt-BR')}
            </span>
            <span className="text-sm font-semibold text-(--macro-calories)">kcal</span>
          </div>

          <div className="flex gap-4">
            {MACROS.map((macro) => {
              // CSS vars no lugar do hex do config: o hex é sempre o tom claro.
              const color = `var(--macro-${macro.field})`
              const MacroIcon = macro.icon
              return (
                <div key={macro.field} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
                  <span className="flex items-center gap-1.5">
                    <MacroIcon size={16} className="shrink-0" style={{ color }} />
                    <span className="text-base font-extrabold tabular-nums" style={{ color }}>
                      {Math.round(scale(selectedFood[macro.field]) * 10) / 10}g
                    </span>
                  </span>
                  <span className="min-w-0 truncate text-xs font-semibold" style={{ color }}>
                    {macro.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!targetId && (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-red-100 bg-red-50 p-4 transition-colors duration-300 dark:border-red-900/30 dark:bg-red-950/40">
          <TriangleAlert size={18} className="shrink-0 text-red-600 dark:text-red-400" />
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            ID não encontrado. Volte e tente novamente.
          </p>
        </div>
      )}

      <label className="mb-2 block text-sm font-bold tracking-tight text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
        Quantidade
      </label>
      <div className="relative">
        <input
          type="number"
          {...nonNegativeInputProps}
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          min={1}
          max={2000}
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-5 pr-14 text-center font-display text-3xl font-extrabold tabular-nums text-neutral-950 shadow-sm outline-none transition-colors duration-200 [appearance:textfield] focus:border-red-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-red-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 select-none text-xl font-semibold text-neutral-400 transition-colors duration-300 dark:text-neutral-500">
          g
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-700 transition-colors duration-200 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!targetId || !quantity || Number(quantity) < 1 || anyPending}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {anyPending && <Spinner size={16} />}
          {anyPending ? 'Adicionando…' : `Adicionar à ${contextLabel}`}
        </button>
      </div>
    </div>
  )
}
