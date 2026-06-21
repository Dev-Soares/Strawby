import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useSignIn } from '../hooks/useSignIn'
import { useGoogleSignIn } from '../hooks/useGoogleSignIn'
import ForgotPasswordModal from './ForgotPasswordModal'
import GoogleAuthButton from './GoogleAuthButton'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const {
    register,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignIn()
  const googleSignIn = useGoogleSignIn()

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      {/* Formulário */}
      <div className="flex-1 min-w-0 bg-neutral-900 rounded-2xl p-8 md:p-10 lg:p-12 flex flex-col">

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-10 md:mb-14">
          Entrar.
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10 flex-1">

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">
              E-mail
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200"
            />
            {errors.email && (
              <p className="text-red-400 text-[11px] mt-2">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">
              Senha
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 bottom-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword
                  ? <EyeSlash size={20} weight="bold" />
                  : <Eye size={20} weight="bold" />
                }
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-[11px] mt-2">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-[12px] font-semibold text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>

          <div className="flex flex-col gap-5 pt-2 mt-auto">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 active:bg-red-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Entrando…' : 'Entrar'}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-700" />
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">ou</span>
              <div className="h-px flex-1 bg-neutral-700" />
            </div>

            <GoogleAuthButton
              label="Continuar com Google"
              onSuccess={googleSignIn.onSuccess}
              onError={googleSignIn.onError}
            />

            <p className="text-[14px] text-neutral-500">
              Não tem conta?{' '}
              <Link
                to="/app/create-account"
                className="font-semibold text-white underline underline-offset-2 hover:text-red-400 transition-colors"
              >
                Cadastre-se agora
              </Link>
            </p>
          </div>

        </form>
      </div>

      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}

      {/* Card lateral */}
      <div className="lg:w-96 shrink-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 text-white flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-[22px] font-bold leading-snug">
            Não tem uma conta?
          </h2>
          <p className="text-red-100 text-[14px] leading-relaxed">
            Crie sua conta e comece a acompanhar suas calorias, proteínas e macros.
          </p>
        </div>
        <Link
          to="/app/create-account"
          className="block text-center border border-white/40 hover:border-white rounded-full px-4 py-3 text-[13px] font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 mt-8"
        >
          Criar conta
        </Link>
      </div>

    </div>
  )
}
