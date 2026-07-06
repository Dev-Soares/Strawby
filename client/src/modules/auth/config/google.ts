// redirect_uri usado no fluxo OAuth auth-code (redirect).
// DEVE estar cadastrado nas "Authorized redirect URIs" do Google Console.
export function getGoogleRedirectUri(): string {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}/app/google-callback`
}
