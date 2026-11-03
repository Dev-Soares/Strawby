/**
 * Ações visuais do mascote Strawby.
 * Cada ação tem uma animação em `client/public/mascot/actions/`.
 */
export const MASCOT_ACTIONS = ['idle', 'thinking', 'happy', 'celebrate', 'upset'] as const

export type MascotAction = (typeof MASCOT_ACTIONS)[number]
