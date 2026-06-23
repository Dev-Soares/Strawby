import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { GOOGLE_REDIRECT_URI } from '../config/google'

export const useGoogleSignIn = () => {
  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: GOOGLE_REDIRECT_URI,
    scope: 'openid email profile',
    onError: () => toast.error('Erro ao autenticar com Google.'),
  })

  return {
    signIn: () => login(),
  }
}
