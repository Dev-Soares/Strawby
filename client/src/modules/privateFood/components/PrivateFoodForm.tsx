import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import {
  Fire,
  PencilSimple,
  X,
  FloppyDisk,
  Check,
} from '@phosphor-icons/react'
import type { CreatePrivateFoodData } from '../types/privateFood'

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
    <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 tracking-tight">
            {mode === 'create' ? 'Novo alimento' : 'Editar alimento'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {mode === 'create' ? 'Preencha os dados nutricionais' : 'Altere os campos desejados'}
          </p>
        </div>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X size={15} weight="bold" className="text-neutral-600" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Nome */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-[0.12em]">
              Nome do alimento
            </span>
          </div>
          <input
            {...register('name')}
            placeholder="Ex: Marmita de frango com legumes"
            className="w-full text-lg sm:text-xl font-bold text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-red-500 pb-1 transition-colors duration-150 placeholder:text-neutral-300 placeholder:font-medium"
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        {/* Porção */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-2xl px-4 sm:px-8 py-5 sm:py-7">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-[0.12em]">Porção de referência</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <input
              {...register('servingSize')}
              placeholder="Ex: 100g, 1 fatia"
              disabled={isPending}
              className="font-display text-3xl sm:text-5xl font-extrabold text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 border-b-2 border-neutral-300 focus:border-neutral-950 pb-1 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-neutral-300 placeholder:font-medium"
            />
            <PencilSimple size={18} weight="bold" className="text-neutral-400 shrink-0 -mb-1" />
          </div>
          {errors.servingSize && <p className="text-center text-[11px] font-bold text-red-500 mt-1.5">{errors.servingSize.message}</p>}
        </div>

        {/* Calorias */}
        <div className="rounded-2xl bg-linear-to-br from-red-50 to-red-100/40 border border-red-100 px-4 sm:px-8 py-5 sm:py-7">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Fire size={14} weight="fill" className="text-red-500" />
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-[0.12em]">Calorias por porção</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <input
              {...register('calories', { valueAsNumber: true })}
              type="number"
              disabled={isPending}
              className="font-display text-5xl sm:text-7xl font-extrabold text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 border-red-300 focus:border-red-500 pb-1 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <PencilSimple size={18} weight="bold" className="text-red-400 shrink-0 -mb-1" />
          </div>
          {errors.calories && <p className="text-center text-[11px] font-bold text-red-500 mt-1.5">{errors.calories.message}</p>}
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Proteína */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-2 sm:px-5 py-4 sm:py-5 flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.14em] text-amber-600 mb-3 sm:mb-4">
              Proteína
            </span>
            <div className="flex items-end justify-center gap-0.5 sm:gap-1 mb-1 w-full">
              <input
                {...register('protein', { valueAsNumber: true })}
                type="number"
                disabled={isPending}
                className="font-display text-3xl sm:text-5xl font-extrabold text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 pb-0.5 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderBottomColor: '#f59e0b55' }}
                onFocus={(e) => { if (!isPending) e.currentTarget.style.borderBottomColor = '#f59e0b' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#f59e0b55' }}
              />
              <span className="text-sm sm:text-base font-bold text-neutral-400 pb-1 shrink-0">g</span>
              <PencilSimple size={14} weight="bold" className="shrink-0 mb-1.5" style={{ color: '#f59e0baa' }} />
            </div>
            {errors.protein && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.protein.message}</p>}
          </div>

          {/* Carboidratos */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-2 sm:px-5 py-4 sm:py-5 flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.14em] text-blue-600 mb-3 sm:mb-4">
              Carboidratos
            </span>
            <div className="flex items-end justify-center gap-0.5 sm:gap-1 mb-1 w-full">
              <input
                {...register('carbs', { valueAsNumber: true })}
                type="number"
                disabled={isPending}
                className="font-display text-3xl sm:text-5xl font-extrabold text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 pb-0.5 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderBottomColor: '#3b82f655' }}
                onFocus={(e) => { if (!isPending) e.currentTarget.style.borderBottomColor = '#3b82f6' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#3b82f655' }}
              />
              <span className="text-sm sm:text-base font-bold text-neutral-400 pb-1 shrink-0">g</span>
              <PencilSimple size={14} weight="bold" className="shrink-0 mb-1.5" style={{ color: '#3b82f6aa' }} />
            </div>
            {errors.carbs && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.carbs.message}</p>}
          </div>

          {/* Gordura */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-2 sm:px-5 py-4 sm:py-5 flex flex-col items-center">
            <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.14em] text-purple-600 mb-3 sm:mb-4">
              Gordura
            </span>
            <div className="flex items-end justify-center gap-0.5 sm:gap-1 mb-1 w-full">
              <input
                {...register('fat', { valueAsNumber: true })}
                type="number"
                disabled={isPending}
                className="font-display text-3xl sm:text-5xl font-extrabold text-neutral-950 leading-none tabular-nums bg-transparent outline-none text-center min-w-0 flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-b-2 pb-0.5 cursor-text transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderBottomColor: '#a855f755' }}
                onFocus={(e) => { if (!isPending) e.currentTarget.style.borderBottomColor = '#a855f7' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#a855f755' }}
              />
              <span className="text-sm sm:text-base font-bold text-neutral-400 pb-1 shrink-0">g</span>
              <PencilSimple size={14} weight="bold" className="shrink-0 mb-1.5" style={{ color: '#a855f7aa' }} />
            </div>
            {errors.fat && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.fat.message}</p>}
          </div>
        </div>

        {/* Footer */}
        {mode === 'edit' ? (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 py-3.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-sm font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FloppyDisk size={16} weight="bold" />
              )}
              {isPending ? 'Salvando…' : 'Salvar alterações'}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-2xl text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 shadow-md shadow-red-200"
          >
            {isPending ? (
              <span className="inline-block w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={18} weight="bold" />
            )}
            {isPending ? 'Cadastrando…' : 'Cadastrar alimento'}
          </button>
        )}
      </div>
    </form>
  )
}
