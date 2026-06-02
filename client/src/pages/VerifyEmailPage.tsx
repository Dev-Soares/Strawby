import { useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, CircleNotch } from '@phosphor-icons/react'
import { useVerifyEmail } from '@/modules/auth/hooks/useVerifyEmail'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const { mutate, isPending, isSuccess, isError } = useVerifyEmail()

  useEffect(() => {
    if (token) {
      mutate(token)
    }
  }, [token, mutate])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        <Link to="/" className="flex items-center gap-3 mb-2">
          <img src="/logo.webp" alt="Strawby" className="w-10 h-10 object-contain" />
          <span className="text-neutral-900 dark:text-neutral-100 text-xl font-black tracking-tighter">
            Strawby
          </span>
        </Link>

        {!token && (
          <>
            <XCircle size={48} className="text-red-500" weight="fill" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Link inválido
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Token de verificação não encontrado.
              </p>
            </div>
            <Link
              to="/app/create-account"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 underline underline-offset-2"
            >
              Criar conta
            </Link>
          </>
        )}

        {token && isPending && (
          <>
            <CircleNotch size={48} className="text-neutral-400 animate-spin" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Verificando seu e-mail...
            </p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle size={48} className="text-green-500" weight="fill" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                E-mail verificado!
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Sua conta foi ativada com sucesso.
              </p>
            </div>
            <button
              onClick={() => navigate('/app/login')}
              className="bg-neutral-900 hover:bg-neutral-700 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-900 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors duration-200"
            >
              Fazer login
            </button>
          </>
        )}

        {isError && (
          <>
            <XCircle size={48} className="text-red-500" weight="fill" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Link inválido ou expirado
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                O link de verificação expirou ou já foi utilizado.
              </p>
            </div>
            <Link
              to="/app/create-account"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 underline underline-offset-2"
            >
              Criar nova conta
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
