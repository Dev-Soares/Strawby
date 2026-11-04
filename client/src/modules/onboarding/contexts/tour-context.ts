import { createContext } from 'react'

export type TourValue = {
  /** Abre o tutorial do perfil do usuário logado. */
  start: () => void
  isActive: boolean
}

/**
 * O tutorial navega entre telas, então o estado dele vive acima das rotas —
 * dentro de uma página ele morreria no primeiro passo que troca de rota.
 */
export const TourContext = createContext<TourValue | null>(null)
