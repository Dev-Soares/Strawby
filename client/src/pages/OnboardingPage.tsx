import OnboardingForm from '@/modules/auth/components/OnboardingForm'
import PageTitle from '@/shared/components/PageTitle'

export default function OnboardingPage() {
  return (
    <>
      <PageTitle title="Primeiros passos" />
      <div className="min-h-dvh bg-white transition-colors duration-300 dark:bg-neutral-950">
        <OnboardingForm />
      </div>
    </>
  )
}
