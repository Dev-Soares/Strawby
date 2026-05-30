import AppLayout from '../shared/layouts/AppLayout'
import { useAuth } from '../modules/auth/hooks/useAuth'

export default function NutritionistHomePage() {
  const { data: user } = useAuth()

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-10 lg:py-12 min-h-screen">
        <p className="text-xs sm:text-sm font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">
          Nutricionista
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-neutral-100 leading-tight tracking-tight">
          Olá, {user?.name ?? 'Bem-vindo'}
        </h1>
      </div>
    </AppLayout>
  )
}
