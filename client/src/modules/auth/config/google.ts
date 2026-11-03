// Client ID do Google OAuth. Vazio = login com Google desabilitado.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export const isGoogleAuthEnabled = GOOGLE_CLIENT_ID.length > 0

// redirect_uri usado no fluxo OAuth auth-code (redirect).
// DEVE estar cadastrado nas "Authorized redirect URIs" do Google Console.
export function getGoogleRedirectUri(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/app/google-callback`
}
