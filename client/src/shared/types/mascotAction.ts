/**
 * Ações visuais do mascote Strawby.
 * Cada ação tem uma animação em `client/public/mascot/actions/`.
 */
export const MASCOT_ACTIONS = ['idle', 'thinking', 'happy', 'celebrate', 'upset'] as const

export type MascotAction = (typeof MASCOT_ACTIONS)[number]

/**
 * `loop`   — repete enquanto a ação estiver ativa
 * `settle` — toca uma vez e volta pro `idle` em loop
 * `once`   — toca uma vez e congela no último frame
 */
export type MascotPlayback = 'loop' | 'settle' | 'once'
