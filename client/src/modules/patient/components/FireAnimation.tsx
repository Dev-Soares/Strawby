import { useRef, useState } from 'react'
import Lottie, { type LottieRefCurrentProps } from 'lottie-react'
import fireLoop from '../assets/fire-icon.json'
import fireReveal from '../assets/fire-reveal.json'

export default function FireAnimation() {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [phase, setPhase] = useState<'reveal' | 'loop'>('reveal')

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={phase === 'reveal' ? fireReveal : fireLoop}
      loop={phase === 'loop'}
      onDOMLoaded={() => lottieRef.current?.setSpeed(phase === 'reveal' ? 0.8 : 0.35)}
      onComplete={() => setPhase('loop')}
      style={{ width: 140, height: 140 }}
    />
  )
}
