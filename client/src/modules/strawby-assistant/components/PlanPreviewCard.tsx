import { motion } from 'framer-motion'
import { Check, Flame, RefreshCw, Target, X } from 'lucide-react'
import { MACROS } from '@/shared/config/macros'
import type { PlanDraft } from '../types/planGeneration'

interface PlanPreviewCardProps {
  draft: PlanDraft
  onConfirm: (draft: PlanDraft) => void
  onDiscard: () => void
  isConfirming: boolean
}

export default function PlanPreviewCard({
  draft,
  onConfirm,
  onDiscard,
  isConfirming,
}: PlanPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/40">
            <Target size={23} className="text-red-600 dark:text-red-400" />
          </span>

          <h3 className="font-display min-w-0 flex-1 truncate text-lg leading-none font-extrabold tracking-tight text-neutral-950 dark:text-neutral-100 sm:text-xl">
            Seu plano recomendado
          </h3>
        </div>

        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/30">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-red-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-red-600 dark:text-red-400">
              Meta calórica diária
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-extrabold tabular-nums text-neutral-950 dark:text-neutral-50">
              {Math.round(draft.calories).toLocaleString('pt-BR')}
            </span>
            <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">kcal</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {MACROS.map((macro) => {
            const MacroIcon = macro.icon
            return (
              <div
                key={macro.field}
                className={`${macro.bg} ${macro.border} flex min-w-0 flex-col items-center rounded-xl border px-2 py-3`}
              >
                <MacroIcon size={18} style={{ color: macro.color }} />
                <span className="mt-1.5 text-lg font-extrabold tabular-nums text-neutral-950 dark:text-neutral-50">
                  {Math.round(draft[macro.field])}g
                </span>
                <span className={`text-[9px] font-extrabold uppercase tracking-[0.14em] ${macro.textColor}`}>
                  {macro.short}
                </span>
              </div>
            )
          })}
        </div>

        {draft.replacesExisting && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <RefreshCw size={14} className="shrink-0" />
            Você já tem um plano — ao confirmar, ele será substituído por este.
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onConfirm(draft)}
            disabled={isConfirming}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={18} />
            {isConfirming
              ? 'Salvando...'
              : draft.replacesExisting
                ? 'Substituir meu plano'
                : 'Salvar meu plano'}
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
