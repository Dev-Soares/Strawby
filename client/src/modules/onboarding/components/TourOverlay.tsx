import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { NUTRITIONIST_TOUR } from '../config/nutritionistTour'
import { PATIENT_TOUR } from '../config/patientTour'
import { useTourFlow, type TourFinishReason } from '../hooks/useTourFlow'
import { useTourLayout } from '../hooks/useTourLayout'
import { useTourScroll } from '../hooks/useTourScroll'
import TourCallout from './TourCallout'
import TourControls from './TourControls'
import TourMascot from './TourMascot'
import TourSpotlight from './TourSpotlight'

interface TourOverlayProps {
  role: 'patient' | 'nutritionist'
  onFinish: (reason: TourFinishReason) => void
}

/**
 * O tutorial é o mascote andando pelo app.
 *
 * Ele sai da bolinha do assistente, encosta no que cada passo está explicando
 * — o elemento de verdade, recortado no escuro — e volta pra bolinha no fim,
 * mostrando onde encontrá-lo depois. A camada também trava o app: quem avança
 * é o botão do balão.
 */
export default function TourOverlay({ role, onFinish }: TourOverlayProps) {
  const steps = role === 'nutritionist' ? NUTRITIONIST_TOUR : PATIENT_TOUR
  const { step, isFirst, isLast, goNext, goBack, skip, mascot } = useTourFlow(steps, onFinish)

  // o balão muda de altura com o texto, e é ela que decide de que lado o bloco
  // cabe — por isso ele mede a si mesmo e devolve aqui
  const [calloutHeight, setCalloutHeight] = useState<number>()
  const handleHeightChange = useCallback((height: number) => setCalloutHeight(height), [])

  useTourScroll(step.target)
  const layout = useTourLayout(step.target, step.assistantHandoff, calloutHeight)

  return createPortal(
    <div className="fixed inset-0 z-100 overflow-hidden">
      <TourSpotlight rect={layout.rect} />

      <TourMascot
        layout={layout.mascot}
        isDocked={layout.isDocked}
        isPulsing={step.assistantHandoff}
        action={mascot.action}
        playback={mascot.playback}
        animationKey={mascot.key}
      />

      <TourCallout
        layout={layout.callout}
        mascotCenterX={layout.mascot.left + layout.mascot.size / 2}
        message={step.prompt}
        onHeightChange={handleHeightChange}
      />

      <TourControls
        cta={step.cta ?? (isLast ? 'Concluir' : 'Continuar')}
        canGoBack={!isFirst}
        avoidDock={layout.isDocked}
        onNext={goNext}
        onBack={goBack}
        onSkip={skip}
      />
    </div>,
    document.body,
  )
}
