import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'
import HeroQuestionCards from './HeroQuestionCards'

const ease = [0.34, 1.05, 0.64, 1] as const

/** A única ação da hero: o mascote anotando o que comeu. */
const HERO_ACTION = 'note-taking' as const

/**
 * O palco do mascote e das dúvidas que o produto ajuda a responder.
 */
const HeroMascot = () => {
  // ~700KB por animação: baixar antes tira a espera do primeiro quadro
  useEffect(() => {
    preloadMascotActions([HERO_ACTION])
  }, [])

  return (
    <div className="relative mx-auto h-[205px] w-full max-w-[390px] sm:h-[300px]">
      <HeroQuestionCards />

      <motion.div
        className="absolute left-1/2 top-1/2 z-10 flex h-[165px] w-[165px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[250px] sm:w-[250px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <StrawbyMascot action={HERO_ACTION} playback="loop" className="h-full w-full" />
      </motion.div>
    </div>
  )
}

export default HeroMascot
