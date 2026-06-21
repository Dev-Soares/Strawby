import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowLeft } from '@phosphor-icons/react'
import { GoogleLogin } from '@react-oauth/google'
import { useSignUp } from '../hooks/useSignUp'
import { useGoogleSignIn } from '../hooks/useGoogleSignIn'
import Spinner from '../../../shared/components/Spinner'

export default function SignUpForm() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    trigger,
    watch,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignUp()

  const googleSignIn = useGoogleSignIn()

  const handleStep1 = async () => {
    const valid = await trigger(['name', 'email'])
    if (valid) setStep(2)
  }

  const stepLabel = step === 1 ? 'Cadastrar.' : 'Sua senha.'

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      <div className="flex-1 min-w-0 bg-neutral-900 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[0, 1].map((i) => (
            <div key={i} className={`h-0.75 w-10 rounded-full transition-colors duration-300 ${i < step ? 'bg-white' : 'bg-neutral-700'}`} />
          ))}
        </div>

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-10 md:mb-14">
          {stepLabel}
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10 flex-1">

          {/* ── Step 1 — Name + Email ── */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">Nome</label>
                <input
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200"
                />
                {errors.name && <p className="text-red-400 text-[11px] mt-2">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">E-mail</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200"
                />
                {errors.email && <p className="text-red-400 text-[11px] mt-2">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={handleStep1}
                  className="w-full rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Continuar
                </button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-700" />
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">ou</span>
                  <div className="h-px flex-1 bg-neutral-700" />
                </div>

                <div className="w-fit mx-auto my-3">
                  <GoogleLogin
                    onSuccess={googleSignIn.onSuccess}
                    onError={googleSignIn.onError}
                    useOneTap
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    width="240"
                  />
                </div>

                <p className="text-[14px] text-neutral-500">
                  Já tem conta?{' '}
                  <Link to="/app/login" className="font-semibold text-white underline underline-offset-2 hover:text-red-400 transition-colors">
                    Entrar agora
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ── Step 2 — Password ── */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">Senha</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-0 bottom-3 text-neutral-500 hover:text-white transition-colors cursor-pointer">
                    {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-[11px] mt-2">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-3 uppercase tracking-widest">Confirmar Senha</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-neutral-700 bg-transparent pb-3 text-[15px] text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-colors duration-200 pr-8"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-0 bottom-3 text-neutral-500 hover:text-white transition-colors cursor-pointer">
                    {showConfirmPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-2">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" {...register('acceptTerms')} className="sr-only" />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                    watch('acceptTerms') ? 'bg-red-600 border-red-600' : 'border-neutral-600 group-hover:border-neutral-400'
                  }`}>
                    {watch('acceptTerms') && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] text-neutral-400 leading-relaxed">
                    Li e aceito os{' '}
                    <Link to="/termos" target="_blank" className="text-white font-semibold underline underline-offset-2">Termos de Uso</Link>
                    {' '}e a{' '}
                    <Link to="/privacidade" target="_blank" className="text-white font-semibold underline underline-offset-2">Política de Privacidade</Link>
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-red-400 text-[11px] -mt-3">{errors.acceptTerms.message}</p>}

                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-neutral-600 text-white hover:border-neutral-400 transition-colors cursor-pointer shrink-0">
                    <ArrowLeft size={16} weight="bold" />
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full bg-red-600 text-white font-bold py-3.5 px-12 text-[14px] hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isPending && <Spinner size={16} />}
                    {isPending ? 'Criando conta…' : 'Criar conta'}
                  </button>
                </div>

                <p className="text-[14px] text-neutral-500">
                  Já tem conta?{' '}
                  <Link to="/app/login" className="font-semibold text-white underline underline-offset-2 hover:text-red-400 transition-colors">Entrar agora</Link>
                </p>
              </div>
            </>
          )}

        </form>
      </div>

      <div className="lg:w-96 shrink-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 text-white flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-[22px] font-bold leading-snug">
            Já tem uma conta?
          </h2>
          <p className="text-red-100 text-[14px] leading-relaxed">
            Entre e continue acompanhando suas calorias, proteínas e macros.
          </p>
        </div>
        <Link
          to="/app/login"
          className="block text-center border border-white/40 hover:border-white rounded-full px-4 py-3 text-[13px] font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 mt-8"
        >
          Entrar
        </Link>
      </div>

    </div>
  )
}
