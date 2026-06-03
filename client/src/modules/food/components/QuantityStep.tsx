import { Fire } from '@phosphor-icons/react'
import type { SelectableFood } from '../types/selectableItem'

const macros = [
  { key: 'protein' as const, label: 'Prot', colorClass: 'text-amber-500' },
  { key: 'carbs' as const, label: 'Carb', colorClass: 'text-blue-500' },
  { key: 'fat' as const, label: 'Gord', colorClass: 'text-violet-500' },
]

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

  return (
    <div className="max-w-md mx-auto">
      {selectedFood && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 mb-6 transition-colors duration-300">
          <p className="text-base font-bold text-neutral-950 dark:text-neutral-100 mb-1 transition-colors duration-300">{selectedFood.name}</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4 transition-colors duration-300">por {quantity || 0}g</p>
          <div className="flex items-center gap-1.5 mb-4">
            <Fire size={13} weight="fill" className="text-red-500 shrink-0" />
            <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-200 tabular-nums leading-none transition-colors duration-300">
              {Math.round((selectedFood.calories * q) / base)}
            </span>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 pb-0.5 transition-colors duration-300">kcal</span>
          </div>
          <div className="flex gap-4">
            {macros.map(({ key, label, colorClass }) => (
              <div key={key} className="flex-1 flex flex-col items-center">
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mb-1 transition-colors duration-300">{label}</span>
                <span className={`text-base font-extrabold tabular-nums ${colorClass}`}>
                  {Math.round((selectedFood[key] * q) / base * 10) / 10}g
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!targetId && (
        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-4 text-sm font-semibold text-red-600 transition-colors duration-300">
          ID não encontrado. Volte e tente novamente.
        </div>
      )}

      <div className="mb-2">
        <label className="block text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3 transition-colors duration-300">
          Quantidade (g)
        </label>
        <div className="relative">
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            min={1}
            max={2000}
            className="w-full text-center text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-5 pr-14 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-all duration-200 shadow-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-extrabold text-neutral-400 dark:text-neutral-500 pointer-events-none select-none transition-colors duration-300">
            g
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-150 cursor-pointer"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!targetId || !quantity || Number(quantity) < 1 || anyPending}
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2"
        >
          {anyPending ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {anyPending ? 'Adicionando…' : `Adicionar à ${contextLabel}`}
        </button>
      </div>
    </div>
  )
}
