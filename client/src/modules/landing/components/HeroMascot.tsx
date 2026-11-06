import { useEffect } from 'react'
import { motion } from 'framer-motion'
import StrawbyMascot from '@/shared/components/StrawbyMascot'
import { preloadMascotActions } from '@/shared/config/mascotActions'

const ease = [0.34, 1.05, 0.64, 1] as const

/** A única ação da hero: o mascote anotando o que comeu. */
const HERO_ACTION = 'note-taking' as const

/**
 * O palco do mascote.
 *
 * Antes era uma HISTÓRIA em duas cenas (`useMascotStory`: comer e depois pegar
 * o celular), com dois cartões flutuantes entrando junto de cada gesto. Os
 * cartões saíram — no celular cobriam o mascote e empurravam o título para
 * fora da primeira dobra — e, sem eles, a troca de cena virava movimento sem
 * assunto. Ficou UMA ação, em loop: `note-taking`, que é o gesto do produto.
 */
const HeroMascot = () => {
  // ~700KB por animação: baixar antes tira a espera do primeiro quadro
  useEffect(() => {
    preloadMascotActions([HERO_ACTION])
  }, [])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[205px] sm:max-w-[250px]">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
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
