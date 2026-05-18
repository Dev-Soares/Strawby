import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import {
  Flame,
  Barbell,
  Wheat,
  Drop,
  Leaf,
  Salt,
  Scales,
  Check,
  X,
} from '@phosphor-icons/react'
import type { CreatePrivateFoodData } from '../types/privateFood'

interface PrivateFoodFormProps {
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
  const inputBase =
    'w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 placeholder:font-medium outline-none focus:border-red-400 focus:ring-[3px] focus:ring-red-100 transition-all duration-200'

  const labelBase = 'flex items-center gap-1.5 text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2'

  const errorClass = 'text-[11px] font-bold text-red-500 mt-1.5'

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <Flame size={20} weight="fill" className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest leading-tight">
              {mode === 'create' ? 'Novo alimento' : 'Editar alimento'}
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
              {mode === 'create' ? 'Preencha os dados nutricionais' : 'Altere os campos desejados'}
            </p>
          </div>
        </div>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 hover:text-red-500 transition-colors cursor-pointer bg-neutral-100 hover:bg-red-50 px-3 py-2 rounded-lg"
          >
            <X size={14} weight="bold" />
            Cancelar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {/* Nome */}
        <div>
          <label className={labelBase}>
            Nome do alimento
          </label>
          <input
            {...register('name')}
            placeholder="Ex: Marmita de frango com legumes"
            className={inputBase}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Macros principais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className={labelBase}>
              <Flame size={13} weight="fill" className="text-orange-500" />
              Calorias
            </label>
            <input
              type="number"
              step="0.1"
              {...register('calories', { valueAsNumber: true })}
              placeholder="kcal"
              className={inputBase}
            />
            {errors.calories && <p className={errorClass}>{errors.calories.message}</p>}
          </div>

          <div>
            <label className={labelBase}>
              <Barbell size={13} weight="fill" className="text-blue-500" />
              Proteína
            </label>
            <input
              type="number"
              step="0.1"
              {...register('protein', { valueAsNumber: true })}
              placeholder="g"
              className={inputBase}
            />
            {errors.protein && <p className={errorClass}>{errors.protein.message}</p>}
          </div>

          <div>
            <label className={labelBase}>
              <Wheat size={13} weight="fill" className="text-amber-500" />
              Carboidrato
            </label>
            <input
              type="number"
              step="0.1"
              {...register('carbs', { valueAsNumber: true })}
              placeholder="g"
              className={inputBase}
            />
            {errors.carbs && <p className={errorClass}>{errors.carbs.message}</p>}
          </div>

          <div>
            <label className={labelBase}>
              <Drop size={13} weight="fill" className="text-yellow-500" />
              Gordura
            </label>
            <input
              type="number"
              step="0.1"
              {...register('fat', { valueAsNumber: true })}
              placeholder="g"
              className={inputBase}
            />
            {errors.fat && <p className={errorClass}>{errors.fat.message}</p>}
          </div>
        </div>

        {/* Opcionais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
          <div>
            <label className={labelBase}>
              <Leaf size={13} weight="fill" className="text-emerald-500" />
              Fibra
            </label>
            <input
              type="number"
              step="0.1"
              {...register('fiber', { valueAsNumber: true })}
              placeholder="Opcional — g"
              className={inputBase}
            />
            {errors.fiber && <p className={errorClass}>{errors.fiber.message}</p>}
          </div>

          <div>
            <label className={labelBase}>
              <Salt size={13} weight="fill" className="text-sky-500" />
              Sódio
            </label>
            <input
              type="number"
              step="0.1"
              {...register('sodium', { valueAsNumber: true })}
              placeholder="Opcional — mg"
              className={inputBase}
            />
            {errors.sodium && <p className={errorClass}>{errors.sodium.message}</p>}
          </div>

          <div>
            <label className={labelBase}>
              <Scales size={13} weight="fill" className="text-violet-500" />
              Porção
            </label>
            <input
              {...register('servingSize')}
              placeholder="Ex: 100g, 1 fatia"
              className={inputBase}
            />
            {errors.servingSize && <p className={errorClass}>{errors.servingSize.message}</p>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 py-4 rounded-2xl text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-md shadow-red-200"
        >
          {isPending ? (
            <span className="inline-block w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check size={18} weight="bold" />
          )}
          {isPending
            ? 'Salvando…'
            : mode === 'create'
            ? 'Cadastrar alimento'
            : 'Salvar alterações'}
        </button>
      </div>
    </form>
  )
}
