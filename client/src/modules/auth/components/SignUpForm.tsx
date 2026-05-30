import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowLeft } from '@phosphor-icons/react'
import { useSignUp } from '../hooks/useSignUp'

export default function SignUpForm() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    trigger,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignUp()

  const handleNext = async () => {
    const valid = await trigger(['name', 'email'])
    if (valid) setStep(2)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      <div className="flex-1 min-w-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col">

        <div className="flex items-center gap-2 mb-8">
          <div className="h-[3px] w-10 rounded-full bg-white" />
          <div
            className={`h-[3px] w-10 rounded-full transition-colors duration-300 ${
              step === 2 ? 'bg-white' : 'bg-white/30'
            }`}
          />
        </div>

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-10 md:mb-14">
          {step === 1 ? 'Cadastrar.' : 'Sua senha.'}
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10 flex-1">

          {step === 1 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">
                  Nome
                </label>
                <input
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200"
                />
                {errors.name && (
                  <p className="text-yellow-200 text-[11px] mt-2">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">
                  E-mail
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200"
                />
                {errors.email && (
                  <p className="text-yellow-200 text-[11px] mt-2">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-fit rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150 cursor-pointer"
                >
                  Continuar
                </button>

                <p className="text-[13px] text-white">
                  Já tem conta?{' '}
                  <Link
                    to="/app/login"
                    className="font-semibold text-white underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Entrar agora
                  </Link>
                </p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 bottom-3 text-white hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showPassword
                      ? <EyeSlash size={15} weight="bold" />
                      : <Eye size={15} weight="bold" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="text-yellow-200 text-[11px] mt-2">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200 pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-0 bottom-3 text-white hover:text-white/70 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword
                      ? <EyeSlash size={15} weight="bold" />
                      : <Eye size={15} weight="bold" />
                    }
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-yellow-200 text-[11px] mt-2">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 text-white hover:border-white transition-colors duration-150 cursor-pointer shrink-0"
                  >
                    <ArrowLeft size={16} weight="bold" />
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? 'Criando conta…' : 'Criar conta'}
                  </button>
                </div>

                <p className="text-[13px] text-white">
                  Já tem conta?{' '}
                  <Link
                    to="/app/login"
                    className="font-semibold text-white underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Entrar agora
                  </Link>
                </p>
              </div>
            </>
          )}

        </form>
      </div>

      <div className="lg:w-96 shrink-0 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 lg:p-10 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-300">
        <div className="flex flex-col gap-5">
          <h2 className="text-[22px] font-bold leading-snug text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
            Já tem uma conta?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-[14px] leading-relaxed transition-colors duration-300">
            Entre e continue acompanhando suas calorias, proteínas e macros.
          </p>
        </div>
        <Link
          to="/app/login"
          className="block text-center border-2 border-neutral-900 dark:border-neutral-200 hover:bg-neutral-900 dark:hover:bg-neutral-200 hover:text-white dark:hover:text-neutral-900 rounded-full px-4 py-3 text-[13px] font-semibold transition-all duration-200 mt-8"
        >
          Entrar
        </Link>
      </div>

    </div>
  )
}
