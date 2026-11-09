import { ChevronRight, GraduationCap } from 'lucide-react'
import { useTour } from '../hooks/useTour'

/**
 * Atalho dos Ajustes para rever o tutorial.
 *
 * O tour abre pela própria rota do primeiro passo, então não importa de onde
 * ele é chamado — o provider vive acima das rotas.
 */
export default function ReplayTourSection() {
  const { start, isActive } = useTour()

  return (
    <section className="mb-5">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
        Tutorial
      </p>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
        <button
          type="button"
          onClick={start}
          disabled={isActive}
          className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 disabled:opacity-50 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <GraduationCap size={15} className="text-red-500" />
          </div>

          <span className="flex-1 text-left">
            <span className="block text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              Refazer tutorial
            </span>
            <span className="block text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              O Strawby mostra o app aba por aba de novo
            </span>
          </span>

          <ChevronRight size={14} className="text-neutral-400 dark:text-neutral-600 shrink-0" />
        </button>
      </div>
    </section>
  )
}
