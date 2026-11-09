import { ChevronLeft } from 'lucide-react'
import StepButton from '@/shared/components/StepButton'

interface TourControlsProps {
  cta: string
  canGoBack: boolean
  /** No fecho a bolinha ocupa o canto: a barra desliza pra esquerda dela. */
  avoidDock: boolean
  /** No convite inicial a recusa é "Não quero"; depois dele vira "Pular tutorial". */
  isIntro: boolean
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
 *
 * A recusa é o mesmo botão âmbar o tutorial inteiro: no primeiro passo ela
 * responde o convite do mascote ("Não quero"), dos demais em diante vira
 * "Pular tutorial". Âmbar fechado de propósito — mesmo peso de botão do CTA,
 * um degrau abaixo no brilho pra não disputar com o vermelho.
 *
 * No mobile ela entra na mesma fileira do CTA: ali a barra come o topo da tela,
 * que é conteúdo que vários passos precisam mostrar. No desktop, onde a barra
 * mora num canto vazio, ela volta pra linha de baixo.
 */
export default function TourControls({
  cta,
  canGoBack,
  avoidDock,
  isIntro,
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
      <div className="mx-auto flex w-full max-w-md items-stretch gap-2 sm:mx-0 sm:w-auto sm:flex-col">
        {/* `contents` dissolve esta linha no mobile: os três botões viram uma
            fileira só. No desktop ela volta a ser a linha de cima. */}
        <div className="contents sm:flex sm:items-stretch sm:gap-2">
          {canGoBack && (
            <StepButton variant="secondary" onClick={onBack} className="px-3 sm:px-5">
              <ChevronLeft size={16} strokeWidth={3} />
              <span className="sr-only">Voltar</span>
            </StepButton>
          )}

          <StepButton onClick={onNext} className="flex-1 px-3 text-xs sm:px-8 sm:text-sm">
            {cta}
          </StepButton>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-2xl border-b-4 border-amber-800 bg-amber-600 px-2.5 py-4 text-xs font-extrabold uppercase tracking-normal text-white transition-colors duration-150 hover:bg-amber-500 active:translate-y-0.5 active:border-b-2 sm:w-full sm:flex-none sm:px-5 sm:text-sm sm:tracking-wide"
        >
          {isIntro ? 'Não quero' : 'Pular tutorial'}
        </button>
      </div>
    </div>
  )
}
