import { useAuth } from '../modules/auth/hooks/useAuth'
import PatientHomePage from './PatientHomePage'
import NutritionistHomePage from './NutritionistHomePage'

export default function MainPage() {
  const { data: user } = useAuth()

  if (user?.role === 'nutritionist') return <NutritionistHomePage />
  return <PatientHomePage />
}
