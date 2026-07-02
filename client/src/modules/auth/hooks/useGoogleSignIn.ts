import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { GOOGLE_REDIRECT_URI } from '../config/google'

const isGoogleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID

export const useGoogleSignIn = () => {
  // Sem client_id configurado, o @react-oauth quebra ao inicializar.
  // Nesse caso desabilitamos o login com Google (login por e-mail continua funcionando).
  const login = isGoogleEnabled
    ? useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: GOOGLE_REDIRECT_URI,
        scope: 'openid email profile',
        onError: () => toast.error('Erro ao autenticar com Google.'),
      })
    : null

  return {
    isEnabled: isGoogleEnabled,
    signIn: () => login?.(),
  }
}
