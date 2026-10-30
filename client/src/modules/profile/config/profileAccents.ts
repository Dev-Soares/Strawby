export type ProfileAccent = {
  /** Cor principal — var() para acompanhar o tema */
  color: string
  /** Fundo claro do mesmo tom — pills de ícone, trilhos e badges */
  track: string
}

/** Acento de cada card do perfil — espelha as vars definidas em index.css */
export const PROFILE_ACCENTS = {
  brand: { color: 'var(--profile-brand)', track: 'var(--profile-brand-light)' },
  nutritionist: { color: 'var(--profile-nutri)', track: 'var(--profile-nutri-light)' },
  body: { color: 'var(--profile-body)', track: 'var(--profile-body-light)' },
  goal: { color: 'var(--profile-goal)', track: 'var(--profile-goal-light)' },
  since: { color: 'var(--profile-since)', track: 'var(--profile-since-light)' },
} satisfies Record<string, ProfileAccent>
