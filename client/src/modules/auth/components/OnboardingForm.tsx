import { useState } from 'react'
import { GenderMale, GenderFemale, Heartbeat, Stethoscope, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCompleteOnboarding } from '../hooks/useCompleteOnboarding'

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

export default function OnboardingForm() {
  const [step, setStep] = useState(1)

  const {
    register,
    trigger,
    watch,
    setValue,
    onSubmit,
    formState: { errors },
    isPending,
  } = useCompleteOnboarding()

  const role = watch('role')
  const gender = watch('gender')
  const isPatient = role === 'patient'
  const totalSteps = isPatient ? 2 : 1

  const handleStep1 = async () => {
    const valid = await trigger(['role', 'acceptTerms'])
    if (!valid) return
    if (isPatient) setStep(2)
    else onSubmit()
  }

  return (
    <div className="flex-1 min-w-0 bg-red-600 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col">

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-0.75 w-10 rounded-full transition-colors duration-300 ${i < step ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>

      <h1 className="text-4xl md:text-[52px] font-black tracking-tight text-white leading-none mb-2">
        {step === 1 ? 'Seu perfil.' : 'Seus dados.'}
      </h1>
      {step === 1 && (
        <p className="text-white/60 text-base font-medium mb-10 md:mb-12">Como você quer usar o Strawby?</p>
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
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200 ${selected ? 'bg-red-600' : 'bg-white/15'}`}>
                      <Icon size={26} weight={selected ? 'fill' : 'bold'} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-extrabold tracking-tight leading-tight transition-colors duration-200 ${selected ? 'text-neutral-950' : 'text-white'}`}>
                        {label}
                      </p>
                      <p className={`text-xs font-semibold mt-1 leading-relaxed transition-colors duration-200 ${selected ? 'text-neutral-800' : 'text-white/80'}`}>
                        {description}
                      </p>
                    </div>
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
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" {...register('acceptTerms')} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                  watch('acceptTerms') ? 'bg-white border-white' : 'border-white/40 group-hover:border-white/60'
                }`}>
                  {watch('acceptTerms') && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[12px] text-white/70 leading-relaxed">
                  Li e aceito os{' '}
                  <Link to="/termos" target="_blank" className="text-white font-semibold underline underline-offset-2">Termos de Uso</Link>
                  {' '}e a{' '}
                  <Link to="/privacidade" target="_blank" className="text-white font-semibold underline underline-offset-2">Política de Privacidade</Link>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-yellow-200 text-[11px] -mt-2">{errors.acceptTerms.message}</p>}

              <button
                type="button"
                onClick={handleStep1}
                disabled={!role || (isPending && !isPatient)}
                className="flex items-center gap-2 w-fit rounded-full bg-white text-red-600 font-bold py-3.5 px-10 text-[14px] hover:bg-neutral-100 active:bg-neutral-200 transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPending && !isPatient ? 'Salvando…' : 'Continuar'} <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          </>
        )}

        {/* ── Step 2 — Body data (patient only) ── */}
        {step === 2 && (
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
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-white text-red-600 font-bold py-3.5 px-12 text-[14px] hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isPending ? 'Salvando…' : 'Concluir'}
              </button>
            </div>
          </>
        )}

      </form>
    </div>
  )
}
