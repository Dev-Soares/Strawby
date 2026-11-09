import { preloadImage } from '../utils/preloadImage'
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
 *
 * `upset` corta no frame 43 (3612ms) pelo mesmo motivo que `thinking`, mas por
 * causa do loop: os 3780ms do arquivo batiam com o instante da troca, então
 * qualquer atraso do timer deixava o WebP voltar ao frame 0 — braços pra baixo,
 * cara neutra — antes do still entrar. A folga de ~1.5 frame mata o pulo, e
 * 42/43 é o par mais parado da animação: a troca não aparece.
 *
 * `goodbye` leva a mesma folga do `upset`, pelo mesmo motivo: é a outra ação
 * que termina em `once`. O still sai do frame 43, onde o braço já desceu.
 *
 * `thinking` e `note-taking` têm 44 frames (3696ms) em vez de 45: as duas foram
 * montadas em `--boomerang`, que toca e volta de ré pra fechar o ciclo sem
 * salto, e nesse modo os extremos não se repetem.
 */
export const MASCOT_ACTION_DURATION_MS: Record<MascotAction, number> = {
  idle: 3780,
  thinking: 2560,
  happy: 3780,
  celebrate: 3780,
  upset: 3640,
  eating: 3780,
  phone: 3780,
  writing: 3780,
  'note-taking': 3696,
  inviting: 3780,
  goodbye: 3640,
}

/** Animação em loop de cada ação. */
export const MASCOT_ACTION_SRC: Record<MascotAction, string> = {
  idle: '/mascot/actions/idle.webp',
  thinking: '/mascot/actions/thinking.webp',
  happy: '/mascot/actions/happy.webp',
  celebrate: '/mascot/actions/celebrate.webp',
  upset: '/mascot/actions/upset.webp',
  eating: '/mascot/actions/eating.webp',
  phone: '/mascot/actions/phone.webp',
  writing: '/mascot/actions/writing.webp',
  'note-taking': '/mascot/actions/note-taking.webp',
  inviting: '/mascot/actions/inviting.webp',
  goodbye: '/mascot/actions/goodbye.webp',
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
  eating: 'loop',
  phone: 'loop',
  writing: 'loop',
  'note-taking': 'loop',
  inviting: 'loop',
  goodbye: 'once',
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
  eating: '/mascot/actions/eating-end.webp',
  phone: '/mascot/actions/phone-end.webp',
  writing: '/mascot/actions/writing-end.webp',
  'note-taking': '/mascot/actions/note-taking-end.webp',
  inviting: '/mascot/actions/inviting-end.webp',
  goodbye: '/mascot/actions/goodbye-end.webp',
}

/**
 * Puxa as animações antes de elas entrarem em cena.
 *
 * O `StrawbyMascot` só monta a camada animada com o arquivo inteiro na mão —
 * em cache frio isso é uma espera de ~700KB na frente do usuário. Chamar daqui
 * com antecedência (ex.: enquanto o mascote pensa) tira a espera do caminho.
 */
export const preloadMascotActions = (actions: MascotAction[]): void => {
  for (const action of actions) {
    void preloadImage(MASCOT_ACTION_SRC[action])
    void preloadImage(MASCOT_ACTION_END_SRC[action])
  }
}
