import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Coffee, ForkKnife, Leaf, Moon, Cookie, Plus, Trash, FloppyDisk } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { createMealSchema, type CreateMealData, type MealItemData } from '../types/createMeal'

type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper'

interface MealTypeConfig {
  icon: Icon
  label: string
  name: string
  accent: string
  accentLight: string
  accentText: string
}

const mealTypes: Record<MealType, MealTypeConfig> = {
  breakfast: { icon: Coffee, label: 'MANHÃ', name: 'Café da manhã', accent: '#ea580c', accentLight: '#fed7aa', accentText: '#c2410c' },
  lunch: { icon: ForkKnife, label: 'ALMOÇO', name: 'Almoço', accent: '#16a34a', accentLight: '#bbf7d0', accentText: '#15803d' },
  snack: { icon: Leaf, label: 'LANCHE', name: 'Lanche', accent: '#2563eb', accentLight: '#bfdbfe', accentText: '#1d4ed8' },
  dinner: { icon: Moon, label: 'JANTAR', name: 'Jantar', accent: '#9333ea', accentLight: '#e9d5ff', accentText: '#7e22ce' },
  supper: { icon: Cookie, label: 'CEIA', name: 'Ceia', accent: '#475569', accentLight: '#cbd5e1', accentText: '#334155' },
}

export default function CreateMealForm() {
  const navigate = useNavigate()
  const [foodInput, setFoodInput] = useState<MealItemData>({ foodName: '', quantity: '' as unknown as number })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateMealData>({
    resolver: zodResolver(createMealSchema),
    defaultValues: { items: [], time: '07:00' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const selectedType = watch('mealType')
  const activeConfig = selectedType ? mealTypes[selectedType] : null

  const addItem = () => {
    if (!foodInput.foodName.trim() || !foodInput.quantity) return
    append({ foodName: foodInput.foodName.trim(), quantity: Number(foodInput.quantity) })
    setFoodInput({ foodName: '', quantity: '' as unknown as number })
  }

  const onSubmit = handleSubmit((data) => {
    console.log('Nova refeição:', data)
    toast.success('Refeição criada com sucesso!')
    navigate('/plan')
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">

      {/* Name */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
          Nome da refeição
        </label>
        <input
          {...register('name')}
          placeholder="Ex: Café da manhã proteico"
          className="font-display w-full text-2xl font-bold text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-neutral-500 pb-2 transition-colors duration-150 placeholder:text-neutral-300"
        />
        {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
      </div>

      {/* Meal type */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <p className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">
          Tipo de refeição
        </p>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(mealTypes) as [MealType, MealTypeConfig][]).map(([key, cfg]) => {
            const Ico = cfg.icon
            const isSelected = selectedType === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setValue('mealType', key, { shouldValidate: true })}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer"
                style={{
                  borderColor: isSelected ? cfg.accent : 'transparent',
                  backgroundColor: isSelected ? cfg.accentLight : '#f9fafb',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? cfg.accentLight : '#f3f4f6' }}
                >
                  <Ico size={18} weight="bold" style={{ color: isSelected ? cfg.accentText : '#9ca3af' }} />
                </div>
                <span
                  className="text-[10px] font-black tracking-widest leading-none text-center"
                  style={{ color: isSelected ? cfg.accentText : '#9ca3af' }}
                >
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.mealType && <p className="text-xs text-red-500 mt-2">{errors.mealType.message}</p>}
      </div>

      {/* Time */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-3">
          Horário
        </label>
        <input
          {...register('time')}
          type="time"
          className="font-display text-3xl font-black text-neutral-950 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-neutral-500 pb-1 transition-colors duration-150 tabular-nums cursor-pointer"
        />
        {errors.time && <p className="text-xs text-red-500 mt-2">{errors.time.message}</p>}
      </div>

      {/* Foods */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">Alimentos</p>
            <p className="text-xs text-neutral-400 mt-0.5">{fields.length} item{fields.length !== 1 ? 's' : ''} adicionado{fields.length !== 1 ? 's' : ''}</p>
          </div>
          {fields.length > 0 && (
            <span
              className="text-xs font-black px-2.5 py-1 rounded-full"
              style={{ backgroundColor: activeConfig?.accentLight ?? '#f3f4f6', color: activeConfig?.accentText ?? '#9ca3af' }}
            >
              {fields.length} alimento{fields.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Add food row */}
        <div className="flex gap-3 mb-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Nome</label>
            <input
              value={foodInput.foodName}
              onChange={(e) => setFoodInput((p) => ({ ...p, foodName: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              placeholder="Ex: Frango grelhado"
              className="text-sm font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-neutral-400 transition-all duration-150 placeholder:text-neutral-300 w-full"
            />
          </div>
          <div className="w-24 flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Qtd (g)</label>
            <input
              type="number"
              value={foodInput.quantity === ('' as unknown as number) ? '' : foodInput.quantity}
              onChange={(e) => setFoodInput((p) => ({ ...p, quantity: Number(e.target.value) }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              placeholder="100"
              min={1}
              max={2000}
              className="text-sm font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-xl px-3 py-3 outline-none focus:border-neutral-400 transition-all duration-150 text-center placeholder:text-neutral-300 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-transparent uppercase tracking-widest select-none">_</span>
            <button
              type="button"
              onClick={addItem}
              className="h-11.5 px-5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shrink-0 transition-colors duration-150 cursor-pointer text-white bg-red-600 hover:bg-red-700"
            >
              <Plus size={16} weight="bold" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Food list */}
        {fields.length > 0 ? (
          <div className="flex flex-col gap-2">
            {fields.map((field, i) => (
              <div
                key={field.id}
                className="flex items-center justify-between px-4 py-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors duration-150"
                style={{ backgroundColor: activeConfig ? `${activeConfig.accentLight}55` : '#f9fafb' }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black"
                    style={{
                      backgroundColor: activeConfig?.accentLight ?? '#f3f4f6',
                      color: activeConfig?.accentText ?? '#9ca3af',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-neutral-800 truncate">{field.foodName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{field.quantity}g por porção</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-4">
                  <span
                    className="text-sm font-black tabular-nums px-3 py-1.5 rounded-xl"
                    style={{
                      backgroundColor: activeConfig?.accentLight ?? '#f3f4f6',
                      color: activeConfig?.accentText ?? '#9ca3af',
                    }}
                  >
                    {field.quantity}g
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
                  >
                    <Trash size={15} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-neutral-200">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
              <Plus size={20} weight="bold" className="text-neutral-300" />
            </div>
            <p className="text-sm font-bold text-neutral-400">Nenhum alimento adicionado</p>
            <p className="text-xs text-neutral-300 mt-1">Preencha o formulário acima e clique em Adicionar</p>
          </div>
        )}
        {errors.items && (
          <p className="text-xs text-red-500 mt-3">{errors.items.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700"
      >
        <FloppyDisk size={17} weight="bold" />
        Salvar refeição
      </button>
    </form>
  )
}
