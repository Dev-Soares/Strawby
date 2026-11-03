import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { getGoogleRedirectUri } from '../config/google'

// Só pode ser usado dentro de GoogleAuthSection, que monta este hook
// apenas quando VITE_GOOGLE_CLIENT_ID está configurado.
export const useGoogleSignIn = () => {
  const signIn = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: getGoogleRedirectUri(),
    scope: 'openid email profile',
    onError: () => toast.error('Erro ao autenticar com Google.'),
  })

  return { signIn }
}
