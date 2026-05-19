import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useSignIn } from '../hooks/useSignIn'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignIn()

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      {/* Formulário */}
      <div className="flex-1 min-w-0">
        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-neutral-900 leading-none mb-10 md:mb-14">
          Entrar.
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10">

          <div>
            <label className="block text-[11px] font-semibold text-red-500 mb-3 uppercase tracking-widest">
              E-mail
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className="w-full border-0 border-b-2 border-neutral-200 bg-transparent pb-3 text-[15px] text-neutral-900 focus:outline-none focus:border-red-500 transition-colors duration-200"
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-2">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-red-500 mb-3 uppercase tracking-widest">
              Senha
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="w-full border-0 border-b-2 border-neutral-200 bg-transparent pb-3 text-[15px] text-neutral-900 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 bottom-3 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                {showPassword
                  ? <EyeSlash size={15} weight="bold" />
                  : <Eye size={15} weight="bold" />
                }
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-2">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-5 pt-2">
            

            <button
              type="submit"
              disabled={isPending}
              className="w-fit rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 active:bg-red-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? 'Entrando…' : 'Entrar'}
            </button>
          </div>

          <p className="text-[13px] text-neutral-400">
            Não tem conta?{' '}
            <Link
              to="/app/create-account"
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-red-600 transition-colors"
            >
              Cadastre-se agora
            </Link>
          </p>

        </form>
      </div>

      {/* Card lateral */}
      <div className="lg:w-96 shrink-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 text-white flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-[22px] font-bold leading-snug">
            Acompanhe sua alimentação em segundos.
          </h2>
          <p className="text-red-100 text-[14px] leading-relaxed">
            Rastreie calorias, proteínas e macros de forma rápida e totalmente gratuita.
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
