import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowLeft, GenderMale, GenderFemale, Heartbeat, Stethoscope, ArrowRight } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSignUp } from '../hooks/useSignUp'

const ROLES = [
  {
    value: 'patient' as const,
    label: 'Paciente',
    description: 'Acompanhe sua nutrição e alcance seus objetivos',
    Icon: Heartbeat,
  },
  {
    value: 'nutritionist' as const,
    label: 'Nutricionista',
    description: 'Gerencie pacientes e crie planos alimentares',
    Icon: Stethoscope,
  },
]

export default function SignUpForm() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    trigger,
    watch,
    setValue,
    onSubmit,
    formState: { errors },
    isPending,
  } = useSignUp()

  const role = watch('role')
  const gender = watch('gender')
  const isPatient = role === 'patient'
  const totalSteps = isPatient ? 4 : 3

  const stepLabel = (s: number) => {
    if (s === 1) return 'Cadastrar.'
    if (s === 2) return 'Seus dados.'
    if (s === 3) return 'Sua senha.'
    return 'Seu perfil.'
  }

  const handleStep1 = async () => {
    const valid = await trigger(['role'])
    if (valid) setStep(2)
  }

  const handleStep2 = async () => {
    const valid = await trigger(['name', 'email'])
    if (valid) setStep(3)
  }

  const handleStep3 = async () => {
    const valid = await trigger(['password', 'confirmPassword'])
    if (!valid) return
    if (isPatient) setStep(4)
    else onSubmit()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 items-stretch w-full">

      <div className="flex-1 min-w-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col">

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-0.75 w-10 rounded-full transition-colors duration-300 ${i < step ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>

        <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-2">
          {stepLabel(step)}
        </h1>
        {step === 1 && (
          <p className="text-white/60 text-base font-medium mb-10 md:mb-12">Escolha como quer usar o Strawby</p>
        )}
        {step !== 1 && <div className="mb-10 md:mb-14" />}

        <form onSubmit={onSubmit} className="flex flex-col gap-8 md:gap-10 flex-1">

          {/* ── Step 1 — Role ── */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                {ROLES.map(({ value, label, description, Icon }) => {
                  const selected = role === value
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      onClick={() => setValue('role', value, { shouldValidate: true })}
                      whileTap={{ scale: 0.985 }}
                      className={`relative flex items-center gap-5 px-5 py-5 rounded-2xl text-left cursor-pointer transition-all duration-200 overflow-hidden ${
                        selected
                          ? 'bg-white shadow-xl shadow-black/20'
                          : 'bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200 ${selected ? 'bg-red-600' : 'bg-white/15'}`}>
                        <Icon size={26} weight={selected ? 'fill' : 'bold'} className="text-white" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[15px] font-extrabold tracking-tight leading-tight transition-colors duration-200 ${selected ? 'text-neutral-950' : 'text-white'}`}>
                          {label}
                        </p>
                        <p className={`text-xs font-semibold mt-1 leading-relaxed transition-colors duration-200 ${selected ? 'text-neutral-800' : 'text-white/80'}`}>
                          {description}
                        </p>
                      </div>

                      {/* Check */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${selected ? 'bg-red-600' : 'border-2 border-white/30'}`}>
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
                {errors.role && <p className="text-yellow-200 text-[11px]">{errors.role.message}</p>}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={handleStep1}
                  disabled={!role}
                  className="flex items-center gap-2 w-fit rounded-full bg-white text-red-600 font-bold py-3.5 px-10 text-[14px] hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar <ArrowRight size={15} weight="bold" />
                </button>
                <p className="text-[13px] text-white">
                  Já tem conta?{' '}
                  <Link to="/app/login" className="font-semibold text-white underline underline-offset-2">
                    Entrar agora
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* ── Step 2 — Name + Email ── */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">Nome</label>
                <input
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200"
                />
                {errors.name && <p className="text-yellow-200 text-[11px] mt-2">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">E-mail</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200"
                />
                {errors.email && <p className="text-yellow-200 text-[11px] mt-2">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 text-white hover:border-white transition-colors cursor-pointer shrink-0">
                    <ArrowLeft size={16} weight="bold" />
                  </button>
                  <button type="button" onClick={handleStep2} className="flex-1 rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 transition-colors cursor-pointer">
                    Continuar
                  </button>
                </div>
                <p className="text-[13px] text-white">
                  Já tem conta?{' '}
                  <Link to="/app/login" className="font-semibold text-white underline underline-offset-2">Entrar agora</Link>
                </p>
              </div>
            </>
          )}

          {/* ── Step 3 — Password ── */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">Senha</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200 pr-8"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-0 bottom-3 text-white hover:text-white/70 transition-colors cursor-pointer">
                    {showPassword ? <EyeSlash size={15} weight="bold" /> : <Eye size={15} weight="bold" />}
                  </button>
                </div>
                {errors.password && <p className="text-yellow-200 text-[11px] mt-2">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">Confirmar Senha</label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200 pr-8"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-0 bottom-3 text-white hover:text-white/70 transition-colors cursor-pointer">
                    {showConfirmPassword ? <EyeSlash size={15} weight="bold" /> : <Eye size={15} weight="bold" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-yellow-200 text-[11px] mt-2">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 text-white hover:border-white transition-colors cursor-pointer shrink-0">
                    <ArrowLeft size={16} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStep3}
                    disabled={isPending && !isPatient}
                    className="flex-1 rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isPending && !isPatient ? 'Criando conta…' : isPatient ? 'Continuar' : 'Criar conta'}
                  </button>
                </div>
                <p className="text-[13px] text-white">
                  Já tem conta?{' '}
                  <Link to="/app/login" className="font-semibold text-white underline underline-offset-2">Entrar agora</Link>
                </p>
              </div>
            </>
          )}

          {/* ── Step 4 — Body data (patient only) ── */}
          {step === 4 && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-white mb-4 uppercase tracking-widest">
                  Sexo biológico
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: 'male' as const, label: 'Masculino', Icon: GenderMale },
                    { value: 'female' as const, label: 'Feminino', Icon: GenderFemale },
                  ]).map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('gender', gender === value ? undefined : value)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${
                        gender === value
                          ? 'bg-white border-white text-red-600'
                          : 'bg-transparent border-white/50 hover:border-white text-white'
                      }`}
                    >
                      <Icon size={22} weight="bold" />
                      <span className="text-[13px] font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
                {errors.gender && <p className="text-yellow-200 text-[11px] mt-2">{errors.gender.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {([
                  { field: 'weight' as const, label: 'Peso', unit: 'kg', placeholder: '70' },
                  { field: 'height' as const, label: 'Altura', unit: 'cm', placeholder: '175' },
                  { field: 'age' as const, label: 'Idade', unit: 'anos', placeholder: '25' },
                ]).map(({ field, label, unit, placeholder }) => (
                  <div key={field}>
                    <label className="block text-[11px] font-semibold text-white mb-3 uppercase tracking-widest">
                      {label} <span className="text-white/50 normal-case">({unit})</span>
                    </label>
                    <input
                      {...register(field, { valueAsNumber: true })}
                      type="number"
                      placeholder={placeholder}
                      className="w-full border-0 border-b-2 border-white/50 bg-transparent pb-3 text-[15px] text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors[field] && <p className="text-yellow-200 text-[11px] mt-2">{errors[field]?.message}</p>}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-5 pt-2 mt-auto">
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setStep(3)} className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/50 text-white hover:border-white transition-colors cursor-pointer shrink-0">
                    <ArrowLeft size={16} weight="bold" />
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? 'Criando conta…' : 'Criar conta'}
                  </button>
                </div>
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
