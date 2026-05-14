import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { PlanData } from '../types/plan'

interface MacroRow {
  label: string
  fieldName: keyof Pick<PlanData, 'protein' | 'carbs' | 'fat'>
  color: string
  trackColor: string
  max: number
}

const macroRows: MacroRow[] = [
  { label: 'Proteína', fieldName: 'protein', color: '#f59e0b', trackColor: '#fef3c7', max: 500 },
  { label: 'Carboidratos', fieldName: 'carbs', color: '#3b82f6', trackColor: '#dbeafe', max: 800 },
  { label: 'Gordura', fieldName: 'fat', color: '#a855f7', trackColor: '#f3e8ff', max: 300 },
]

interface MacroConfigProps {
  register: UseFormRegister<PlanData>
  errors: FieldErrors<PlanData>
  watchValues: { protein: number; carbs: number; fat: number }
}

export default function MacroConfig({ register, errors, watchValues }: MacroConfigProps) {
  return (
    <div className="space-y-4">
      {macroRows.map((row) => {
        const value = watchValues[row.fieldName] || 0
        const progress = Math.min(value / row.max, 1)
        const errorMsg = errors[row.fieldName]?.message

        return (
          <div key={row.fieldName}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-sm font-medium text-neutral-700">{row.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  {...register(row.fieldName, { valueAsNumber: true })}
                  type="number"
                  className="w-16 text-right text-sm font-bold text-neutral-900 bg-transparent outline-none border-b-2 border-neutral-200 focus:border-red-400 transition-colors duration-200 pb-0.5"
                />
                <span className="text-xs text-neutral-400">g</span>
              </div>
            </div>

            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: row.trackColor }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%`, backgroundColor: row.color }}
              />
            </div>

            {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
          </div>
        )
      })}
    </div>
  )
}
