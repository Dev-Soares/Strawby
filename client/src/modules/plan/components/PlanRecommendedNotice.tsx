import { Info } from 'lucide-react'

/**
 * Isenção para planos calculados pelo app. Fica visível enquanto o plano for
 * de origem automática: o número sai de uma fórmula sobre o perfil do
 * paciente, não de uma avaliação profissional, e isso precisa estar dito na
 * tela — não só no momento em que o plano foi gerado.
 */
export default function PlanRecommendedNotice() {
  return (
    <div className="mt-4 flex max-w-xl items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5 dark:border-amber-900/40 dark:bg-amber-950/30">
      <Info size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
        Estas metas foram estimadas automaticamente a partir do seu perfil e servem como
        ponto de partida. Elas <strong className="font-bold">não substituem</strong> a
        avaliação de um nutricionista, que pode ajustá-las ao seu histórico de saúde.
      </p>
    </div>
  )
}
