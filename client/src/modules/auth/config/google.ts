// redirect_uri usado no fluxo OAuth auth-code (redirect).
// DEVE estar cadastrado nas "Authorized redirect URIs" do Google Console.
export const GOOGLE_REDIRECT_URI = `${window.location.origin}/app/google-callback`
