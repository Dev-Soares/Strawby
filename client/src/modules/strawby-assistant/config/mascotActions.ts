import type { MascotAction } from '../types/mascotAction'

/**
 * Animações geradas por `scripts/mascot-frames.py`:
 * 45 frames a 15fps = 3015ms por loop, 320x320, WebP com alpha.
 */
export const MASCOT_ACTION_DURATION_MS = 3015

/** Animação em loop de cada ação. */
export const MASCOT_ACTION_SRC: Record<MascotAction, string> = {
  idle: '/mascot/actions/idle.webp',
  thinking: '/mascot/actions/thinking.webp',
  happy: '/mascot/actions/happy.webp',
  celebrate: '/mascot/actions/celebrate.webp',
  upset: '/mascot/actions/upset.webp',
}

/**
 * Frame final estático de cada ação.
 * O WebP animado é gravado com loop infinito — para travar no fim trocamos a
 * imagem por este still em vez de embarcar um segundo arquivo animado.
 */
export const MASCOT_ACTION_END_SRC: Record<MascotAction, string> = {
  idle: '/mascot/actions/idle-end.webp',
  thinking: '/mascot/actions/thinking-end.webp',
  happy: '/mascot/actions/happy-end.webp',
  celebrate: '/mascot/actions/celebrate-end.webp',
  upset: '/mascot/actions/upset-end.webp',
}
