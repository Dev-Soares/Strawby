import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import MascotSpeech from '@/shared/components/MascotSpeech'
import Spinner from '@/shared/components/Spinner'
import StepButton from '@/shared/components/StepButton'
import StepProgress from '@/shared/components/StepProgress'
import { useOnboardingFlow } from '../hooks/useOnboardingFlow'
import GoalHint from './GoalHint'
import OnboardingBirthDateStep from './OnboardingBirthDateStep'
import OnboardingGenderStep from './OnboardingGenderStep'
import OnboardingGoalRecap from './OnboardingGoalRecap'
import OnboardingMeasureStep from './OnboardingMeasureStep'
import OnboardingRoleStep from './OnboardingRoleStep'
import OnboardingTermsStep from './OnboardingTermsStep'

/**
 * Onboarding em formato de conversa: o mascote faz uma pergunta por tela e
 * reage à resposta. A ordem dos passos vem de `useOnboardingFlow`.
 */
export default function OnboardingForm() {
  const {
    register,
    values,
    formState: { errors },
    stepId,
    step,
    stepIndex,
    totalSteps,
    direction,
    isFirst,
    isLast,
    canContinue,
    goNext,
    goBack,
    clearStepError,
    selectRole,
    selectGender,
    selectBirthDate,
    toggleTerms,
    mascot,
    isPending,
  } = useOnboardingFlow()

  // Enter em qualquer campo avança — nunca envia o formulário direto
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void goNext()
  }

  // no último passo o submit valida o formulário inteiro: um erro de passo
  // anterior precisa aparecer no balão, senão o botão falha em silêncio
  const stepError =
    step.fields.map((field) => errors[field]?.message).find(Boolean) ??
    (isLast ? Object.values(errors).find((error) => error?.message)?.message : undefined)

  const body = {
    role: <OnboardingRoleStep value={values.role} onSelect={selectRole} />,
    gender: <OnboardingGenderStep value={values.gender} onSelect={selectGender} />,
    birthDate: <OnboardingBirthDateStep value={values.birthDate} onChange={selectBirthDate} />,
    height: (
      <OnboardingMeasureStep
        field="height"
        unit="cm"
        placeholder="175"
        maxDecimals={0}
        register={register}
        onEdit={clearStepError}
      />
    ),
    weight: (
      <OnboardingMeasureStep
        field="weight"
        unit="kg"
        placeholder="70"
        maxDecimals={1}
        register={register}
        onEdit={clearStepError}
      />
    ),
    targetWeight: (
      <OnboardingMeasureStep
        field="targetWeight"
        unit="kg"
        placeholder="72"
        maxDecimals={1}
        register={register}
        onEdit={clearStepError}
      >
        <GoalHint weight={values.weight} target={values.targetWeight} />
        <OnboardingGoalRecap weight={values.weight} target={values.targetWeight} />
      </OnboardingMeasureStep>
    ),
    terms: <OnboardingTermsStep isAccepted={values.acceptTerms === true} onToggle={toggleTerms} />,
  }[stepId]

  return (
    <form onSubmit={handleSubmit} className="flex min-h-dvh flex-col">
      <header className="mx-auto w-full max-w-xl px-4 pt-5 sm:px-6">
        <StepProgress stepIndex={stepIndex} totalSteps={totalSteps} />
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        <MascotSpeech
          message={stepError ?? step.prompt}
          action={mascot.action}
          playback={mascot.playback}
          animationKey={mascot.key}
          isError={Boolean(stepError)}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepId}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 border-t-2 border-neutral-100 bg-white/90 backdrop-blur-sm dark:border-neutral-900 dark:bg-neutral-950/90">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 py-4 sm:px-6">
          {!isFirst && (
            <StepButton variant="secondary" type="button" onClick={goBack} disabled={isPending}>
              <ChevronLeft size={16} strokeWidth={3} />
              <span className="hidden sm:inline">Voltar</span>
            </StepButton>
          )}

          <StepButton type="submit" disabled={!canContinue || isPending} className="flex-1">
            {isPending && <Spinner size={16} className="border-white/30 border-t-white" />}
            {isPending ? 'Salvando…' : isLast ? (step.cta ?? 'Concluir') : 'Continuar'}
          </StepButton>
        </div>
      </footer>
    </form>
  )
}
