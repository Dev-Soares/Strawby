import { motion } from 'framer-motion'
import { ArrowRightLeft, Flame, Ham, Wheat, Droplets } from 'lucide-react'
import type { SubstitutionSuggestion } from '../types/substitution'

interface SubstitutionSuggestionsProps {
  originalFoodName: string
  substitutions: SubstitutionSuggestion[]
}

export default function SubstitutionSuggestions({
  originalFoodName,
  substitutions,
}: SubstitutionSuggestionsProps) {
  const validSubstitutions = substitutions.filter((s) => s.food)

  if (validSubstitutions.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Não encontrei substituições para "{originalFoodName}" no banco de alimentos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Alternativas para <span className="font-semibold text-neutral-900 dark:text-neutral-100">{originalFoodName}</span>:
      </p>
      {validSubstitutions.map((substitution, index) => (
        <motion.div
          key={substitution.food?.id ?? index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ArrowRightLeft size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base font-bold text-neutral-900 dark:text-neutral-100">
                {substitution.food?.name}
              </h4>
              <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">{substitution.reason}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <MacroBadge icon={Flame} value={Math.round(substitution.food?.calories ?? 0)} label="kcal" color="text-red-600 dark:text-red-400" bg="bg-red-50 dark:bg-red-950/40" />
                <MacroBadge icon={Ham} value={Math.round(substitution.food?.protein ?? 0)} label="g prot" color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-950/40" />
                <MacroBadge icon={Wheat} value={Math.round(substitution.food?.carbs ?? 0)} label="g carb" color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/40" />
                <MacroBadge icon={Droplets} value={Math.round(substitution.food?.fat ?? 0)} label="g gord" color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/40" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MacroBadge({
  icon: Icon,
  value,
  label,
  color,
  bg,
}: {
  icon: typeof Flame
  value: number
  label: string
  color: string
  bg: string
}) {
  return (
    <span className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold tabular-nums ${bg} ${color}`}>
      <Icon size={12} />
      {value.toLocaleString('pt-BR')} {label}
    </span>
  )
}
