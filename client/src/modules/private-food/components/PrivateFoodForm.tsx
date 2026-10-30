import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Check, Flame, Pencil, Save } from 'lucide-react'
import type { CreatePrivateFoodData } from '../types/privateFood'
import Spinner from '@/shared/components/Spinner'
import { MACROS } from '@/shared/config/macros'
import { nonNegativeInputProps } from '@/shared/utils/nonNegativeInputProps'

export interface PrivateFoodFormProps {
  register: UseFormRegister<CreatePrivateFoodData>
  errors: FieldErrors<CreatePrivateFoodData>
  mode: 'create' | 'edit'
  isPending: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  onCancel: () => void
}

export default function PrivateFoodForm({
  register,
  errors,
  mode,
  isPending,
  onSubmit,
  onCancel,
}: PrivateFoodFormProps) {
  const errorClass = 'text-[11px] font-bold text-red-500 mt-1.5'

  return (
    <form onSubmit={onSubmit} className="p-6 sm:p-7">
      {/* Header — o X de fechar é do modal, não duplicar aqui */}
      <div className="mb-5 pr-12">
        <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">
          {mode === 'create' ? 'Novo alimento' : 'Editar alimento'}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 transition-colors duration-300">
          {mode === 'create' ? 'Preencha os dados nutricionais' : 'Altere os campos desejados'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Nome */}
        <div>
          <label className="mb-1.5 block text-sm font-bold tracking-tight text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Nome do alimento
          </label>
          <input
            {...register('name')}
            placeholder="Ex: Marmita de frango com legumes"
            className="w-full border-b-2 border-neutral-200 bg-transparent pb-1 text-lg font-bold text-neutral-950 outline-none transition-colors duration-150 placeholder:font-medium placeholder:text-neutral-300 focus:border-red-500 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Porção */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-5 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-800/40">
          <label className="mb-2 block text-sm font-bold tracking-tight text-neutral-500 dark:text-neutral-400 transition-colors duration-300">
            Porção de referência
          </label>
          <div className="flex items-end justify-center gap-2">
            <input
              {...register('servingSize')}
              placeholder="Ex: 100g, 1 fatia"
              disabled={isPending}
              className="min-w-0 flex-1 cursor-text border-b-2 border-neutral-300 bg-transparent pb-1 text-center font-display text-3xl font-extrabold leading-none tabular-nums text-neutral-950 outline-none transition-colors duration-150 placeholder:text-base placeholder:font-medium placeholder:text-neutral-300 focus:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"
            />
            <Pencil size={16} className="mb-1.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
          </div>
          {errors.servingSize && <p className="mt-1.5 text-center text-[11px] font-bold text-red-500">{errors.servingSize.message}</p>}
        </div>

        {/* Calorias */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-5 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="mb-2 flex items-center gap-2">
            <Flame size={16} className="text-(--macro-calories)" />
            <span className="text-sm font-bold tracking-tight text-(--macro-calories)">
              Calorias por porção
            </span>
          </div>

          <div className="flex items-end justify-center gap-2">
            <input
              {...register('calories', { valueAsNumber: true })}
              type="number"
              {...nonNegativeInputProps}
              disabled={isPending}
              className="min-w-0 flex-1 cursor-text border-b-2 border-(--macro-calories-light) bg-transparent pb-1 text-center font-display text-4xl font-extrabold leading-none tabular-nums text-neutral-950 outline-none transition-colors duration-150 [appearance:textfield] focus:border-(--macro-calories) disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="shrink-0 pb-1.5 text-sm font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
            <Pencil size={16} className="mb-1.5 shrink-0 text-(--macro-calories)" />
          </div>
          {errors.calories && <p className="mt-1.5 text-center text-[11px] font-bold text-red-500">{errors.calories.message}</p>}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {MACROS.map((macro) => {
            // CSS vars no lugar do hex do config: o hex é sempre o tom claro.
            const color = `var(--macro-${macro.field})`
            const track = `var(--macro-${macro.field}-light)`
            return (
              <div
                key={macro.field}
                className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-2 py-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-800/40"
              >
                <span
                  className="mb-2 min-w-0 truncate text-xs font-bold tracking-tight"
                  style={{ color }}
                >
                  {macro.label}
                </span>
                <div className="flex w-full items-end justify-center gap-1">
                  <input
                    {...register(macro.field, { valueAsNumber: true })}
                    type="number"
                    {...nonNegativeInputProps}
                    disabled={isPending}
                    style={{ borderColor: track }}
                    className="min-w-0 flex-1 cursor-text border-b-2 bg-transparent pb-0.5 text-center font-display text-3xl font-extrabold leading-none tabular-nums text-neutral-950 outline-none transition-colors duration-150 [appearance:textfield] disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 pb-1 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                    {macro.unit}
                  </span>
                </div>
                {errors[macro.field] && (
                  <p className="mt-1 text-[10px] font-bold text-red-500">{errors[macro.field]?.message}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {mode === 'edit' ? (
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 cursor-pointer rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-700 transition-colors duration-200 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? <Spinner size={16} /> : <Save size={18} />}
              {isPending ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? <Spinner size={16} /> : <Check size={18} />}
            {isPending ? 'Cadastrando…' : 'Cadastrar alimento'}
          </button>
        )}
      </div>
    </form>
  )
}
