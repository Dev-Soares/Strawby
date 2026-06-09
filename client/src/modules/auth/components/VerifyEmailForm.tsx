import { useLocation, Link } from 'react-router-dom'
import { EnvelopeSimple } from '@phosphor-icons/react'
import { useVerifyEmail } from '../hooks/useVerifyEmail'
import { useResendVerification } from '../hooks/useResendVerification'

export default function VerifyEmailForm() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  const {
    register,
    onSubmit,
    formState: { errors },
    isPending,
  } = useVerifyEmail()

  const { mutate: resend, isPending: isResending } = useResendVerification(email ?? '')

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      <div className="flex-1 min-w-0 bg-neutral-900 rounded-2xl p-8 md:p-10 lg:p-12 flex flex-col">

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-4">
          Verifique<br />seu e-mail.
        </h1>

        {email && (
          <p className="text-neutral-400 text-[14px] mb-10">
            Enviamos um código de 6 dígitos para{' '}
            <span className="text-white font-semibold">{email}</span>
          </p>
        )}

        {!email && (
          <p className="text-neutral-400 text-[14px] mb-6">
            Insira o código de 6 dígitos enviado para seu e-mail.
          </p>
        )}

        <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3.5 mb-8">
          <p className="text-amber-300 text-[14px] leading-relaxed">
            Não encontrou o e-mail? <span className="font-semibold text-amber-200">Verifique a caixa de spam ou lixo eletrônico.</span>
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

          <div className="flex flex-col gap-5 pt-2 mt-auto">
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 active:bg-red-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Verificando…' : 'Verificar e-mail'}
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
              Já tem conta?{' '}
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
          <EnvelopeSimple size={40} weight="bold" className="text-red-200" />
          <h2 className="text-[22px] font-bold leading-snug">
            Verifique sua caixa de entrada
          </h2>
          <p className="text-red-100 text-[14px] leading-relaxed">
            O código expira em 1 hora. Verifique também a pasta de spam caso não encontre o e-mail.
          </p>
        </div>
        <Link
          to="/app/create-account"
          className="block text-center border border-white/40 hover:border-white rounded-full px-4 py-3 text-[13px] font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 mt-8"
        >
          Criar nova conta
        </Link>
      </div>

    </div>
  )
}
