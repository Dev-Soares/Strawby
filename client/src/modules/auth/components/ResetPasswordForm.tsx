import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { LockKey, Eye, EyeSlash } from '@phosphor-icons/react'
import { useResetPassword } from '../hooks/useResetPassword'
import { useResendResetPassword } from '../hooks/useResendResetPassword'
import Spinner from '../../../shared/components/Spinner'

export default function ResetPasswordForm() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    onSubmit,
    formState: { errors },
    isPending,
  } = useResetPassword()

  const { mutate: resend, isPending: isResending } = useResendResetPassword(email ?? '')

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      <div className="flex-1 min-w-0 bg-neutral-900 rounded-2xl p-8 md:p-10 lg:p-12 flex flex-col">

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-4">
          Nova<br />senha.
        </h1>

        {email ? (
          <p className="text-neutral-400 text-[14px] mb-10">
            Código enviado para{' '}
            <span className="text-white font-semibold">{email}</span>
          </p>
        ) : (
          <p className="text-neutral-400 text-[14px] mb-6">
            Insira o código de 6 dígitos enviado para seu e-mail e crie uma nova senha.
          </p>
        )}

        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3.5 mb-8">
          <p className="text-amber-300 text-[14px] leading-relaxed">
            Não encontrou o e-mail?{' '}
            <span className="font-semibold text-amber-200">Verifique a caixa de spam ou lixo eletrônico.</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10 flex-1">

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">
              Código de verificação
            </label>
            <input
              {...register('code')}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              autoComplete="one-time-code"
              className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[24px] font-bold text-white tracking-[0.5em] placeholder-neutral-700 focus:outline-none focus:border-red-500 transition-colors duration-200"
            />
            {errors.code && (
              <p className="text-red-400 text-[11px] mt-2">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">
              Nova senha
            </label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 bottom-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-[11px] mt-2">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">
              Confirmar senha
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-0 bottom-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-[11px] mt-2">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-5 pt-2 mt-auto">
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 active:bg-red-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Spinner size={16} />}
              {isPending ? 'Redefinindo…' : 'Redefinir senha'}
            </button>

            {email && (
              <button
                type="button"
                onClick={() => resend()}
                disabled={isResending}
                className="w-full rounded-full border border-neutral-700 text-neutral-400 font-semibold py-3 px-12 text-[14px] hover:border-neutral-500 hover:text-neutral-300 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
              >
                {isResending ? 'Reenviando…' : 'Reenviar código'}
              </button>
            )}

            <p className="text-[14px] text-neutral-500">
              Lembrou a senha?{' '}
              <Link
                to="/app/login"
                className="font-semibold text-white underline underline-offset-2 hover:text-red-400 transition-colors"
              >
                Entrar
              </Link>
            </p>
          </div>

        </form>
      </div>

      <div className="lg:w-96 shrink-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 text-white flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <LockKey size={40} weight="bold" className="text-red-200" />
          <h2 className="text-[22px] font-bold leading-snug">
            Crie uma senha forte
          </h2>
          <p className="text-red-100 text-[14px] leading-relaxed">
            O código expira em 1 hora. Use pelo menos 8 caracteres com letras e números para uma senha segura.
          </p>
        </div>
        <Link
          to="/app/login"
          className="block text-center border border-white/40 hover:border-white rounded-full px-4 py-3 text-[13px] font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 mt-8"
        >
          Voltar para o login
        </Link>
      </div>

    </div>
  )
}
