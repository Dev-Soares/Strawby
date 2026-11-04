import { ChevronLeft } from 'lucide-react'
import StepButton from '@/shared/components/StepButton'

interface TourControlsProps {
  cta: string
  canGoBack: boolean
  /** No fecho a bolinha ocupa o canto: a barra desliza pra esquerda dela. */
  avoidDock: boolean
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

/**
 * Os controles do tutorial, parados no mesmo canto do começo ao fim.
 *
 * Eles não acompanham o mascote de propósito: o botão que o usuário aperta a
 * cada passo tem que estar sempre no mesmo lugar — quem passeia pela tela é a
 * explicação, não o comando.
 *
 * No mobile isso é o topo, porque a TabBar ocupa a largura inteira do rodapé e
 * é alvo de vários passos. No desktop a nav é uma pílula centralizada, então a
 * barra fica no canto inferior direito — só no fecho ela abre espaço pra
 * bolinha do assistente, que nasce ali.
 */
export default function TourControls({
  cta,
  canGoBack,
  avoidDock,
  onNext,
  onBack,
  onSkip,
}: TourControlsProps) {
  return (
    <div
      className={`absolute inset-x-0 top-0 px-4 pt-5 transition-[right] duration-300 sm:inset-x-auto sm:top-auto sm:bottom-6 sm:px-0 sm:pt-0 ${
        avoidDock ? 'sm:right-32' : 'sm:right-6'
      }`}
    >
      <div className="mx-auto flex w-full max-w-md items-center gap-2 sm:mx-0 sm:w-auto">
        {canGoBack && (
          <StepButton variant="secondary" onClick={onBack} className="py-3.5">
            <ChevronLeft size={16} strokeWidth={3} />
            <span className="sr-only">Voltar</span>
          </StepButton>
        )}

        <StepButton onClick={onNext} className="flex-1 py-3.5 text-sm sm:flex-none sm:px-8">
          {cta}
        </StepButton>

        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 cursor-pointer rounded-2xl bg-white px-4 py-3.5 text-[11px] font-extrabold uppercase tracking-wide text-neutral-500 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          Pular
        </button>
      </div>
    </div>
  )
}
