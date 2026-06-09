import { Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import OnboardingPage from '../pages/OnboardingPage'
import VerifyEmailPage from '../pages/VerifyEmailPage'
import PublicOnlyRoute from '../shared/components/PublicOnlyRoute'
import OnboardingRoute from '../shared/components/OnboardingRoute'

export const authRoutes = [
  <Route key="login" path="/app/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />,
  <Route key="sign-up" path="/app/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />,
  <Route key="verify-email" path="/app/verify-email" element={<VerifyEmailPage />} />,
  <Route key="onboarding" path="/app/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />,
]
