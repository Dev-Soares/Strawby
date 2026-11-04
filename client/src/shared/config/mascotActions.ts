import type { MascotAction, MascotPlayback } from '../types/mascotAction'

/**
 * Quando a ação termina, em ms — é o instante em que o `StrawbyMascot` troca
 * a animação pelo still de `MASCOT_ACTION_END_SRC`.
 *
 * Animações geradas por `scripts/mascot-frames.py` (45 frames, 320x320, WebP
 * com alpha) e desaceleradas por `scripts/mascot-retime.py`: 84ms por frame.
 *
 * `thinking` para antes do fim de propósito: os últimos frames devolvem o
 * mascote à pose neutra pra fechar o loop sem pulo, então congelar lá mostraria
 * ele parado em vez de pensando. Corta no frame 30, que é onde o still está —
 * a pose ainda está firme, longe do começo da descida do braço.
 */
export const MASCOT_ACTION_DURATION_MS: Record<MascotAction, number> = {
  idle: 3780,
  thinking: 2560,
  happy: 3780,
  celebrate: 3780,
  upset: 3780,
}

/** Animação em loop de cada ação. */
export const MASCOT_ACTION_SRC: Record<MascotAction, string> = {
  idle: '/mascot/actions/idle.webp',
  thinking: '/mascot/actions/thinking.webp',
  happy: '/mascot/actions/happy.webp',
  celebrate: '/mascot/actions/celebrate.webp',
  upset: '/mascot/actions/upset.webp',
}

/**
 * Como cada ação termina quando ninguém manda o contrário.
 * `thinking` e `upset` são gestos com fim claro — repetir em loop deixa o
 * mascote com cara de GIF travado, então param no último frame.
 */
export const MASCOT_DEFAULT_PLAYBACK: Record<MascotAction, MascotPlayback> = {
  idle: 'loop',
  thinking: 'once',
  happy: 'settle',
  celebrate: 'settle',
  upset: 'once',
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
